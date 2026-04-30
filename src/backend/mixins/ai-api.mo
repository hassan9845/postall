import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import PostsTypes "../types/posts";
import AiTypes "../types/ai";
import AccountsTypes "../types/accounts";
import AiLib "../lib/ai";
import PostsLib "../lib/posts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  posts : List.List<PostsTypes.Post>,
  optimizations : Map.Map<Common.PostId, AiTypes.OptimizationResult>,
) {
  /// Required transform query for HTTP outcalls
  public query func transformAi(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Generate per-platform caption and hashtag suggestions for a post via AI API
  public shared ({ caller }) func optimizeCaption(postId : Common.PostId) : async AiTypes.OptimizationResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let post = switch (PostsLib.getPost(posts, postId, caller)) {
      case (?p) { p };
      case null { Runtime.trap("Post not found") };
    };
    let prompt = AiLib.buildOptimizationPrompt(post.originalCaption, post.selectedPlatforms);
    let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a social media expert. Always respond with valid JSON only, no markdown, no explanation.\"},{\"role\":\"user\",\"content\":" # escapeJson(prompt) # "}],\"temperature\":0.7}";
    let responseText = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/chat/completions",
      [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer YOUR_OPENAI_API_KEY" },
      ],
      requestBody,
      transformAi,
    );
    // Build per-platform suggestions by passing raw AI response through to frontend for parsing
    let suggestions = buildSuggestions(post.selectedPlatforms, responseText);
    let result : AiTypes.OptimizationResult = {
      postId;
      suggestions;
      generatedAt = Time.now();
    };
    AiLib.storeOptimizationResult(optimizations, postId, result);
    result;
  };

  /// Retrieve stored optimization result for a post
  public query ({ caller }) func getOptimizationResult(postId : Common.PostId) : async ?AiTypes.OptimizationResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AiLib.getOptimizationResult(optimizations, postId, caller);
  };

  // Helper: build per-platform suggestions with raw AI response tunneled in caption
  func buildSuggestions(
    platforms : [AccountsTypes.Platform],
    rawResponse : Text,
  ) : [AiTypes.PlatformCaption] {
    platforms.map<AccountsTypes.Platform, AiTypes.PlatformCaption>(
      func(p) {
        { platform = p; caption = rawResponse; hashtags = [] }
      }
    );
  };

  // Escape text for JSON string embedding
  func escapeJson(text : Text) : Text {
    let escaped = text.replace(#text "\\", "\\\\");
    let backslashQuote = "\\" # "\"";
    let dquote = "\"";
    let escaped2 = escaped.replace(#text dquote, backslashQuote);
    let escaped3 = escaped2.replace(#char '\n', "\\n");
    let escaped4 = escaped3.replace(#char '\r', "\\r");
    dquote # escaped4 # dquote;
  };
};
