import Common "../types/common";
import PostsTypes "../types/posts";
import AccountsTypes "../types/accounts";

module {
  /// Build per-platform API URL for publishing
  public func buildPublishUrl(platform : AccountsTypes.Platform) : Text {
    switch (platform) {
      case (#instagram) { "https://graph.instagram.com/me/media" };
      case (#facebook) { "https://graph.facebook.com/me/feed" };
      case (#tiktok) { "https://open.tiktokapis.com/v2/post/publish/content/init/" };
      case (#linkedin) { "https://api.linkedin.com/v2/ugcPosts" };
      case (#twitter) { "https://api.twitter.com/2/tweets" };
    };
  };

  /// Build the JSON body for a platform publish call
  public func buildPublishBody(
    platform : AccountsTypes.Platform,
    caption : Text,
    hashtags : [Text],
    mediaUrl : Text,
  ) : Text {
    let hashtagText = if (hashtags.size() == 0) {
      "";
    } else {
      " " # hashtags.foldLeft(
        "",
        func(acc : Text, tag : Text) : Text {
          if (acc == "") { "#" # tag } else { acc # " #" # tag };
        },
      );
    };
    let fullCaption = caption # hashtagText;
    switch (platform) {
      case (#instagram) {
        "{\"image_url\":\"" # mediaUrl # "\",\"caption\":\"" # fullCaption # "\",\"media_type\":\"IMAGE\"}"
      };
      case (#facebook) {
        "{\"message\":\"" # fullCaption # "\",\"link\":\"" # mediaUrl # "\"}"
      };
      case (#tiktok) {
        "{\"post_info\":{\"title\":\"" # fullCaption # "\",\"privacy_level\":\"PUBLIC_TO_EVERYONE\"},\"source_info\":{\"source\":\"FILE_UPLOAD\",\"video_url\":\"" # mediaUrl # "\"}}"
      };
      case (#linkedin) {
        "{\"author\":\"urn:li:person:me\",\"lifecycleState\":\"PUBLISHED\",\"specificContent\":{\"com.linkedin.ugc.ShareContent\":{\"shareCommentary\":{\"text\":\"" # fullCaption # "\"},\"shareMediaCategory\":\"IMAGE\",\"media\":[{\"status\":\"READY\",\"originalUrl\":\"" # mediaUrl # "\"}]}},\"visibility\":{\"com.linkedin.ugc.MemberNetworkVisibility\":\"PUBLIC\"}}"
      };
      case (#twitter) {
        "{\"text\":\"" # fullCaption # "\"}"
      };
    };
  };

  /// Parse the platform API response and return a PlatformResult
  public func parsePublishResponse(
    platform : AccountsTypes.Platform,
    responseText : Text,
    now : Common.Timestamp,
  ) : PostsTypes.PlatformResult {
    // Check for common error indicators in response
    let isError = responseText.contains(#text "\"error\"") or
      responseText.contains(#text "\"errors\"") or
      responseText.contains(#text "\"fault\"");
    if (isError) {
      {
        platform;
        status = #failed(responseText);
        postUrl = null;
        publishedAt = null;
      };
    } else {
      // Try to extract a URL from the response — platform-specific heuristics
      let postUrl : ?Text = switch (platform) {
        case (#twitter) {
          // Twitter returns {"data":{"id":"<id>","text":"..."}}
          if (responseText.contains(#text "\"id\"")) {
            ?("https://twitter.com/i/web/status/unknown");
          } else { null };
        };
        case (#facebook) {
          if (responseText.contains(#text "\"id\"")) {
            ?("https://www.facebook.com/unknown");
          } else { null };
        };
        case (#instagram) {
          if (responseText.contains(#text "\"id\"")) {
            ?("https://www.instagram.com/p/unknown");
          } else { null };
        };
        case (#linkedin) {
          if (responseText.contains(#text "\"id\"")) {
            ?("https://www.linkedin.com/feed/update/unknown");
          } else { null };
        };
        case (#tiktok) {
          if (responseText.contains(#text "publish_id")) {
            ?("https://www.tiktok.com/@user/video/unknown");
          } else { null };
        };
      };
      {
        platform;
        status = #success;
        postUrl;
        publishedAt = ?now;
      };
    };
  };
};
