import { Field, InputType, ID } from "type-graphql";

@InputType()
export class CommentInput {
  @Field(() => ID)
  postId: string;

  @Field(() => String)
  content: string;

  @Field(() => ID, { nullable: true })
  parentId?: string; // for replies

  @Field(() => ID, { nullable: true })
  replyToUserId?: string; // the person being replied to

  @Field(() => [ID], { nullable: true })
  taggedUserIds?: string[]; // store tagged users for future notifications
}
