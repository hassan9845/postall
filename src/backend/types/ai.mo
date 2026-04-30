import Common "common";
import AccountsTypes "accounts";

module {
  public type PlatformCaption = {
    platform : AccountsTypes.Platform;
    caption : Text;
    hashtags : [Text];
  };

  public type OptimizationResult = {
    postId : Common.PostId;
    suggestions : [PlatformCaption];
    generatedAt : Common.Timestamp;
  };
};
