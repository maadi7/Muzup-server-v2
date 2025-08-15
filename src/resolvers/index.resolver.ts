import CommentResolver from "../modules/comment/resolver/comment.resolver";
import PostResolver from "../modules/post/resolver/post.resolver";
import UserResolver from "../modules/user/resolver/user.resolver";

export const resolvers = [UserResolver, PostResolver, CommentResolver] as const;
