import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Common "../types/common";
import AccountsTypes "../types/accounts";

module {
  public func newAccount(
    id : Common.AccountId,
    owner : Common.UserId,
    req : AccountsTypes.AddAccountRequest,
    now : Common.Timestamp,
  ) : AccountsTypes.SocialAccount {
    {
      id;
      owner;
      platform = req.platform;
      var accessToken = req.accessToken;
      var refreshToken = req.refreshToken;
      var accountHandle = req.accountHandle;
      var isActive = true;
      createdAt = now;
    };
  };

  public func toPublic(account : AccountsTypes.SocialAccount) : AccountsTypes.SocialAccountPublic {
    {
      id = account.id;
      platform = account.platform;
      accountHandle = account.accountHandle;
      isActive = account.isActive;
      createdAt = account.createdAt;
    };
  };

  public func getAccountsForUser(
    accounts : Map.Map<Common.AccountId, AccountsTypes.SocialAccount>,
    owner : Common.UserId,
  ) : [AccountsTypes.SocialAccountPublic] {
    let results = List.empty<AccountsTypes.SocialAccountPublic>();
    for ((_, account) in accounts.entries()) {
      if (Principal.equal(account.owner, owner)) {
        results.add(toPublic(account));
      };
    };
    results.toArray();
  };

  public func getAccount(
    accounts : Map.Map<Common.AccountId, AccountsTypes.SocialAccount>,
    id : Common.AccountId,
    caller : Common.UserId,
  ) : ?AccountsTypes.SocialAccount {
    switch (accounts.get(id)) {
      case (?account) {
        if (Principal.equal(account.owner, caller)) { ?account } else { null };
      };
      case null { null };
    };
  };

  public func revokeAccount(
    accounts : Map.Map<Common.AccountId, AccountsTypes.SocialAccount>,
    id : Common.AccountId,
    caller : Common.UserId,
  ) : Bool {
    switch (accounts.get(id)) {
      case (?account) {
        if (Principal.equal(account.owner, caller)) {
          accounts.remove(id);
          true;
        } else {
          false;
        };
      };
      case null { false };
    };
  };
};
