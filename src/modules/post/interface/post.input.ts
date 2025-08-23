import { Field, ID, InputType, ObjectType } from "type-graphql";
import { PostType } from "./post.enum";

@InputType()
export class PostInput {
  @Field(() => String, { nullable: true })
  caption?: string;

  @Field(() => PostType, { nullable: true })
  postType?: PostType;

  @Field(() => String, { nullable: true })
  postUrl?: string;

  @Field(() => String, { nullable: true })
  waveUrl?: string;

  @Field(() => [String], { nullable: true })
  visibleTo?: string[]; // userIds of people who can see this post
}
