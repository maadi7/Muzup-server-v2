import CommentResolver from "../modules/comment/resolver/comment.resolver";
import ConversationResolver from "../modules/conversation/resolver/conversation.resolver";
import MessageResolver from "../modules/message/resolver/message.resolver";
import NotificationResolver from "../modules/notification/resolver/notification.resolver";
import PostResolver from "../modules/post/resolver/post.resolver";
import UserResolver from "../modules/user/resolver/user.resolver";

export const resolvers = [
  UserResolver,
  PostResolver,
  CommentResolver,
  ConversationResolver,
  MessageResolver,
  NotificationResolver,
] as const;
