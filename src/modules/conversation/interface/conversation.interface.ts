import { Field, InputType } from "type-graphql";

@InputType()
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

  @Field(() => String, { nullable: false })
  lastMessageTime: Date;
}
