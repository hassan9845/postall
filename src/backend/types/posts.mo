import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";
import AccountsTypes "accounts";

module {
  public type PublishStatus = {
    #pending;
    #publishing;
    #success;
    #failed : Text;
  };

  public type PlatformResult = {
    platform : AccountsTypes.Platform;
    status : PublishStatus;
    postUrl : ?Text;
    publishedAt : ?Common.Timestamp;
  };

  public type Post = {
    id : Common.PostId;
    owner : Common.UserId;
    mediaBlob : Storage.ExternalBlob;
    mediaFilename : Text;
    originalCaption : Text;
    selectedPlatforms : [AccountsTypes.Platform];
    var publishStatus : PublishStatus;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type PostPublic = {
    id : Common.PostId;
    mediaBlob : Storage.ExternalBlob;
    mediaFilename : Text;
    originalCaption : Text;
    selectedPlatforms : [AccountsTypes.Platform];
    publishStatus : PublishStatus;
    platformResults : [PlatformResult];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreatePostRequest = {
    mediaBlob : Storage.ExternalBlob;
    mediaFilename : Text;
    originalCaption : Text;
    selectedPlatforms : [AccountsTypes.Platform];
  };
};
