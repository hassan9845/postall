import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PostsTypes "../types/posts";
import AiTypes "../types/ai";
import PostsLib "../lib/posts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  posts : List.List<PostsTypes.Post>,
  platformResults : Map.Map<Common.PostId, [PostsTypes.PlatformResult]>,
  optimizations : Map.Map<Common.PostId, AiTypes.OptimizationResult>,
  nextPostId : { var value : Common.PostId },
) {
  /// Create a new post record (media already uploaded via object-storage)
  public shared ({ caller }) func createPost(req : PostsTypes.CreatePostRequest) : async PostsTypes.PostPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextPostId.value;
    nextPostId.value += 1;
    let post = PostsLib.newPost(id, caller, req, Time.now());
    posts.add(post);
    PostsLib.toPublic(post, platformResults);
  };

  /// List all posts for the caller with their publish status
  public query ({ caller }) func listPosts() : async [PostsTypes.PostPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PostsLib.getPostsForUser(posts, platformResults, caller);
  };

  /// Get a single post by ID
  public query ({ caller }) func getPost(postId : Common.PostId) : async ?PostsTypes.PostPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (PostsLib.getPost(posts, postId, caller)) {
      case (?post) { ?PostsLib.toPublic(post, platformResults) };
      case null { null };
    };
  };
};
