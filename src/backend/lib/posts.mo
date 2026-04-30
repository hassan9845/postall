import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Common "../types/common";
import PostsTypes "../types/posts";

module {
  public func newPost(
    id : Common.PostId,
    owner : Common.UserId,
    req : PostsTypes.CreatePostRequest,
    now : Common.Timestamp,
  ) : PostsTypes.Post {
    {
      id;
      owner;
      mediaBlob = req.mediaBlob;
      mediaFilename = req.mediaFilename;
      originalCaption = req.originalCaption;
      selectedPlatforms = req.selectedPlatforms;
      var publishStatus = #pending;
      createdAt = now;
      var updatedAt = now;
    };
  };

  public func toPublic(
    post : PostsTypes.Post,
    platformResults : Map.Map<Common.PostId, [PostsTypes.PlatformResult]>,
  ) : PostsTypes.PostPublic {
    let results = switch (platformResults.get(post.id)) {
      case (?r) { r };
      case null { [] };
    };
    {
      id = post.id;
      mediaBlob = post.mediaBlob;
      mediaFilename = post.mediaFilename;
      originalCaption = post.originalCaption;
      selectedPlatforms = post.selectedPlatforms;
      publishStatus = post.publishStatus;
      platformResults = results;
      createdAt = post.createdAt;
      updatedAt = post.updatedAt;
    };
  };

  public func getPostsForUser(
    posts : List.List<PostsTypes.Post>,
    platformResults : Map.Map<Common.PostId, [PostsTypes.PlatformResult]>,
    owner : Common.UserId,
  ) : [PostsTypes.PostPublic] {
    let filtered = posts.filter(func(p : PostsTypes.Post) : Bool { Principal.equal(p.owner, owner) });
    filtered.map<PostsTypes.Post, PostsTypes.PostPublic>(func(p) { toPublic(p, platformResults) }).toArray();
  };

  public func getPost(
    posts : List.List<PostsTypes.Post>,
    id : Common.PostId,
    caller : Common.UserId,
  ) : ?PostsTypes.Post {
    posts.find(func(p) { p.id == id and Principal.equal(p.owner, caller) });
  };

  public func updatePlatformResult(
    platformResults : Map.Map<Common.PostId, [PostsTypes.PlatformResult]>,
    postId : Common.PostId,
    result : PostsTypes.PlatformResult,
  ) : () {
    let existing = switch (platformResults.get(postId)) {
      case (?r) { r };
      case null { [] };
    };
    // Replace existing result for this platform or append new one
    let updated = existing.filter(func(r : PostsTypes.PlatformResult) : Bool { r.platform != result.platform });
    platformResults.add(postId, updated.concat([result]));
  };
};
