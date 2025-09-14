import { Field, ID, InputType, ObjectType } from "type-graphql";

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

@InputType()
export class UserProfileInput {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  profilePic: string;

  @Field(() => String, { nullable: true })
  bio: string;
}

@ObjectType()
export class UserPostInfo {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  postUrl?: string;

  @Field(() => String, { nullable: true })
  waveUrl?: string;

  @Field(() => String, { nullable: true })
  caption?: string;

  @Field(() => Number)
  reactionsCount: number;

  @Field(() => Number)
  commentsCount: number;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class PaginatedUserPosts {
  @Field(() => [UserPostInfo])
  posts: UserPostInfo[];

  @Field(() => Number)
  totalCount: number;

  @Field(() => Number)
  page: number;

  @Field(() => Number)
  totalPages: number;
}

@ObjectType()
export class UserProfileInfo {
  @Field(() => String)
  username: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  profilePic?: string;

  @Field(() => Number)
  followersCount: number;

  @Field(() => Number)
  followingsCount: number;

  @Field(() => Boolean)
  isPrivate: boolean;

  @Field(() => PaginatedUserPosts)
  posts: PaginatedUserPosts;
}
