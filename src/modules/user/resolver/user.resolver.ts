import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../../../middleware/auth";
import Context from "../../../interface/context";
import UserService from "../service/user.service";
import { User } from "../schema/user.schema";
import {
  UserProfileInfo,
  UserProfileInput,
  UserSignInInput,
  UserToken,
} from "../interface/user.input";
import { query } from "winston";

@Resolver()
export default class UserResolver {
  constructor(private user: UserService) {
    this.user = new UserService();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware([isAuth])
  async meUser(@Ctx() ctx: Context): Promise<User> {
    return await this.user.meUser(ctx);
  }

  @Query(() => Boolean)
  async checkById(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.checkById(id, ctx);
  }

  @Mutation(() => Boolean)
  async saveUserTokens(
    @Arg("input") input: UserToken,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.saveUserTokens(input, ctx);
  }

  @Mutation(() => Boolean)
  async userSingIn(
    @Arg("input") input: UserSignInInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.userSingIn(input, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async editProfile(
    @Arg("input") input: UserProfileInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.editProfile(input, ctx);
  }

  @Query(() => [User])
  @UseMiddleware([isAuth])
  async searchUsers(@Arg("query") query: string): Promise<User[]> {
    return await this.user.searchUsers(query);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async sendRequest(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.sendRequest(id, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async acceptRequest(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.acceptRequest(id, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async blockUser(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.blockUser(id, ctx);
  }

  @Query(() => UserProfileInfo)
  @UseMiddleware([isAuth])
  async getUserProfileInfo(
    @Arg("id") id: string,
    @Ctx() ctx: Context,
    @Arg("page") page?: number,
    @Arg("limit") limit?: number
  ): Promise<UserProfileInfo> {
    return await this.user.getUserProfileInfo(id, ctx, page, limit);
  }
}
