import { Field, ObjectType } from "type-graphql";

@ObjectType() // 👈 instead of @InputType()
export class SidebarChat {
  @Field(() => String, { nullable: false })
  conversationId: string;

  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  profilePic: string;

  @Field(() => String, { nullable: false })
  lastMessage: string;

  @Field(() => Date, { nullable: false }) // 👈 should be Date, not String
  lastMessageTime: Date;
}
