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
import { PostInput } from "../interface/post.input";
import PostService from "../services/post.service";
import { Post } from "../schema/post.schema";

@Resolver()
export default class PostResolver {
  constructor(private post: PostService) {
    this.post = new PostService();
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.post.createPost(input, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async deletePost(
    @Arg("postId") postId: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.post.deletePost(postId, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async addReaction(
    @Arg("postId") postId: string,
    @Arg("emoji") emoji: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.post.addReaction(postId, emoji, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async removeReaction(
    @Arg("postId") postId: string,
    @Arg("emoji") emoji: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.post.removeReaction(postId, emoji, ctx);
  }

  @Query(() => Post)
  @UseMiddleware([isAuth])
  async getPostById(@Arg("id") id: string, @Ctx() ctx: Context): Promise<Post> {
    return await this.post.getPostById(id, ctx);
  }
  @Query(() => [Post])
  @UseMiddleware([isAuth])
  async getTimelinePosts(
    @Ctx() ctx: Context,
    @Arg("page") page?: number,
    @Arg("limit") limit?: number
  ): Promise<Post[]> {
    return await this.post.getTimelinePosts(ctx, page, limit);
  }
}
