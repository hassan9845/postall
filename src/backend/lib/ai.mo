import Map "mo:core/Map";
import Common "../types/common";
import AiTypes "../types/ai";
import AccountsTypes "../types/accounts";

module {
  /// Build the prompt text for AI caption optimization
  public func buildOptimizationPrompt(
    originalCaption : Text,
    platforms : [AccountsTypes.Platform],
  ) : Text {
    let platformNames = platforms.map(
      func(p : AccountsTypes.Platform) : Text {
        switch (p) {
          case (#instagram) { "Instagram" };
          case (#facebook) { "Facebook" };
          case (#tiktok) { "TikTok" };
          case (#linkedin) { "LinkedIn" };
          case (#twitter) { "Twitter/X" };
        };
      }
    );
    let platformList = platformNames.foldLeft(
      "",
      func(acc : Text, name : Text) : Text {
        if (acc == "") { name } else { acc # ", " # name };
      },
    );
    "You are a social media expert. Optimize the following caption for each of these platforms: " # platformList # ".\n\nOriginal caption: " # originalCaption # "\n\nRespond with a JSON array where each element has: platform (one of: instagram, facebook, tiktok, linkedin, twitter), caption (optimized text), hashtags (array of strings without # prefix). Example: [{\"platform\":\"instagram\",\"caption\":\"...\",\"hashtags\":[\"tag1\",\"tag2\"]}]";
  };

  public func storeOptimizationResult(
    optimizations : Map.Map<Common.PostId, AiTypes.OptimizationResult>,
    postId : Common.PostId,
    result : AiTypes.OptimizationResult,
  ) : () {
    optimizations.add(postId, result);
  };

  public func getOptimizationResult(
    optimizations : Map.Map<Common.PostId, AiTypes.OptimizationResult>,
    postId : Common.PostId,
    _caller : Common.UserId,
  ) : ?AiTypes.OptimizationResult {
    optimizations.get(postId);
  };
};
