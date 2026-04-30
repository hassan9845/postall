import Common "common";

module {
  public type Platform = {
    #instagram;
    #facebook;
    #tiktok;
    #linkedin;
    #twitter;
  };

  public type SocialAccount = {
    id : Common.AccountId;
    owner : Common.UserId;
    platform : Platform;
    var accessToken : Text;
    var refreshToken : Text;
    var accountHandle : Text;
    var isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type SocialAccountPublic = {
    id : Common.AccountId;
    platform : Platform;
    accountHandle : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type AddAccountRequest = {
    platform : Platform;
    accessToken : Text;
    refreshToken : Text;
    accountHandle : Text;
  };
};
