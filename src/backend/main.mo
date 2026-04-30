import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Common "types/common";
import AccountsTypes "types/accounts";
import PostsTypes "types/posts";
import AiTypes "types/ai";
import AccountsApi "mixins/accounts-api";
import PostsApi "mixins/posts-api";
import AiApi "mixins/ai-api";
import PublishingApi "mixins/publishing-api";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Accounts state
  let accounts = Map.empty<Common.AccountId, AccountsTypes.SocialAccount>();
  let nextAccountId = { var value : Common.AccountId = 0 };

  // Posts state
  let posts = List.empty<PostsTypes.Post>();
  let nextPostId = { var value : Common.PostId = 0 };
  let platformResults = Map.empty<Common.PostId, [PostsTypes.PlatformResult]>();
  let optimizations = Map.empty<Common.PostId, AiTypes.OptimizationResult>();

  // Mixin includes
  include AccountsApi(accessControlState, accounts, nextAccountId);
  include PostsApi(accessControlState, posts, platformResults, optimizations, nextPostId);
  include AiApi(accessControlState, posts, optimizations);
  include PublishingApi(accessControlState, posts, accounts, platformResults, optimizations);
};
