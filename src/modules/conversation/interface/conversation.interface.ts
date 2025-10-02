import { Message } from "../../message/schema/message.schema";
import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class SidebarChat {
  @Field(() => String, { nullable: false })
  conversationId: string;

  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: true })
  profilePic: string;

  @Field(() => String, { nullable: true })
  lastMessage: string;

  @Field(() => Date, { nullable: true })
  lastMessageTime: Date;

  @Field(() => Number, { nullable: true })
  unreadCount?: number;
}

@ObjectType()
export class OtherUserInfo {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: true })
  profilePic: string;
}

@ObjectType()
export class ChatResponse {
  @Field(() => ID, { nullable: false })
  conversationId: string;

  @Field(() => OtherUserInfo, { nullable: false })
  otherUser: OtherUserInfo;

  @Field(() => [Message])
  messages: Message[];

  @Field(() => Int)
  totalMessages: number;

  @Field(() => Boolean)
  hasMore: boolean;
}
