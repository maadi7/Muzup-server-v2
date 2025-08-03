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
import { UserSignInInput, UserToken } from "../interface/user.input";

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
  // @UseMiddleware([isAuth])
  async userSingIn(
    @Arg("input") input: UserSignInInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.user.userSingIn(input, ctx);
  }
}
