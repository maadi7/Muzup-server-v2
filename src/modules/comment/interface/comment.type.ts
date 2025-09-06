import { Field, ObjectType } from "type-graphql";
import { Comment } from "../schema/comment.schema";

@ObjectType()
export class RepliesResponse {
  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => Boolean)
  hasMore: boolean;
}
