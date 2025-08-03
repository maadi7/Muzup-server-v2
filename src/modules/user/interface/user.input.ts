import { Field, InputType } from "type-graphql";

@InputType()
export class UserToken {
  @Field(() => String, { nullable: false })
  aToken: string;

  @Field(() => String, { nullable: false })
  rToken: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  spotyifyId: string;
}

@InputType()
export class UserSignInInput {
  @Field(() => String, { nullable: false })
  aToken: string;

  @Field(() => String, { nullable: false })
  rToken: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  spotyifyId: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  firstName: string;

  @Field(() => String, { nullable: false })
  lastName: string;

  @Field(() => Date, { nullable: false })
  dob: Date;

  @Field(() => String, { nullable: true })
  profilePic: string;

  @Field(() => String, { nullable: true })
  InstaId: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isArtist: boolean;
}
