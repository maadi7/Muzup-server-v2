import { Field, ObjectType } from "type-graphql";

@ObjectType() // 👈 instead of @InputType()
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

  @Field(() => Date, { nullable: true }) // 👈 should be Date, not String
  lastMessageTime: Date;

  @Field(() => Number, { nullable: true }) // 👈 should be Date, not String
  unreadCount?: number;
}
