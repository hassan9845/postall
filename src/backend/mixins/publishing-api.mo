import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import PostsTypes "../types/posts";
import AccountsTypes "../types/accounts";
import AiTypes "../types/ai";
import PostsLib "../lib/posts";
import PublishingLib "../lib/publishing";

mixin (
  accessControlState : AccessControl.AccessControlState,
  posts : List.List<PostsTypes.Post>,
  accounts : Map.Map<Common.AccountId, AccountsTypes.SocialAccount>,
  platformResults : Map.Map<Common.PostId, [PostsTypes.PlatformResult]>,
  optimizations : Map.Map<Common.PostId, AiTypes.OptimizationResult>,
) {
  /// Required transform query for HTTP outcalls used during publishing
  public query func transformPublish(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Distribute the post to all selected platforms. Updates per-platform status in place.
  public shared ({ caller }) func publishPost(postId : Common.PostId) : async [PostsTypes.PlatformResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let post = switch (PostsLib.getPost(posts, postId, caller)) {
      case (?p) { p };
      case null { Runtime.trap("Post not found") };
    };
    // Mark post as publishing
    post.publishStatus := #publishing;
    post.updatedAt := Time.now();

    let now = Time.now();
    let results = List.empty<PostsTypes.PlatformResult>();

    for (platform in post.selectedPlatforms.values()) {
      // Find an active token for this platform owned by caller
      let tokenOpt = findActiveToken(platform, caller);
      let result : PostsTypes.PlatformResult = switch (tokenOpt) {
        case null {
          {
            platform;
            status = #failed("No connected account for platform");
            postUrl = null;
            publishedAt = null;
          };
        };
        case (?token) {
          // Get best caption from optimization results if available
          let (caption, hashtags) = switch (optimizations.get(postId)) {
            case (?opt) {
              switch (opt.suggestions.find(func(s : AiTypes.PlatformCaption) : Bool { s.platform == platform })) {
                case (?s) { (s.caption, s.hashtags) };
                case null { (post.originalCaption, []) };
              };
            };
            case null { (post.originalCaption, []) };
          };
          // mediaBlob is an opaque reference — use filename as media identifier for the publish body
          let mediaUrl = "blob:" # post.mediaFilename;
          let url = PublishingLib.buildPublishUrl(platform);
          let body = PublishingLib.buildPublishBody(platform, caption, hashtags, mediaUrl);
          let authHeader = buildAuthHeader(platform, token);
          let responseText = await OutCall.httpPostRequest(url, [{ name = "Content-Type"; value = "application/json" }, authHeader], body, transformPublish);
          PublishingLib.parsePublishResponse(platform, responseText, now);
        };
      };
      results.add(result);
      PostsLib.updatePlatformResult(platformResults, postId, result);
    };

    // Update overall post status based on results
    let resultsArr = results.toArray();
    let isSuccess = func(r : PostsTypes.PlatformResult) : Bool {
      switch (r.status) { case (#success) { true }; case (_) { false } };
    };
    let allSuccess = resultsArr.all(isSuccess);
    let anySuccess = resultsArr.any(isSuccess);
    post.publishStatus := if (allSuccess or anySuccess) { #success } else { #failed("All platforms failed") };
    post.updatedAt := Time.now();

    resultsArr;
  };

  /// Get the current per-platform publish results for a post
  public query ({ caller }) func getPublishResults(postId : Common.PostId) : async [PostsTypes.PlatformResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Verify post belongs to caller
    switch (PostsLib.getPost(posts, postId, caller)) {
      case null { Runtime.trap("Post not found") };
      case (?_) {};
    };
    switch (platformResults.get(postId)) {
      case (?r) { r };
      case null { [] };
    };
  };

  // Find an active access token for the given platform belonging to caller
  func findActiveToken(platform : AccountsTypes.Platform, caller : Common.UserId) : ?Text {
    for ((_, account) in accounts.entries()) {
      if (account.platform == platform and account.isActive and Principal.equal(account.owner, caller)) {
        return ?account.accessToken;
      };
    };
    null;
  };

  // Build the authorization header for a platform API call
  func buildAuthHeader(platform : AccountsTypes.Platform, token : Text) : OutCall.Header {
    switch (platform) {
      case (#twitter) { { name = "Authorization"; value = "Bearer " # token } };
      case (#linkedin) { { name = "Authorization"; value = "Bearer " # token } };
      case (#instagram) { { name = "Authorization"; value = "Bearer " # token } };
      case (#facebook) { { name = "Authorization"; value = "Bearer " # token } };
      case (#tiktok) { { name = "Authorization"; value = "Bearer " # token } };
    };
  };
};
