import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import AccountsTypes "../types/accounts";
import AccountsLib "../lib/accounts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  accounts : Map.Map<Common.AccountId, AccountsTypes.SocialAccount>,
  nextAccountId : { var value : Common.AccountId },
) {
  /// List all connected social accounts for the caller
  public query ({ caller }) func listSocialAccounts() : async [AccountsTypes.SocialAccountPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AccountsLib.getAccountsForUser(accounts, caller);
  };

  /// Add a new connected social account for the caller
  public shared ({ caller }) func addSocialAccount(req : AccountsTypes.AddAccountRequest) : async AccountsTypes.SocialAccountPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextAccountId.value;
    nextAccountId.value += 1;
    let account = AccountsLib.newAccount(id, caller, req, Time.now());
    accounts.add(id, account);
    AccountsLib.toPublic(account);
  };

  /// Revoke / remove a connected social account
  public shared ({ caller }) func revokeSocialAccount(accountId : Common.AccountId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AccountsLib.revokeAccount(accounts, accountId, caller);
  };
};
