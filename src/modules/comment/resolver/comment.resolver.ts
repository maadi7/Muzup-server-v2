import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/auth";
import Context from "../../../interface/context";
import { CommentInput } from "../interface/comment.input";
import CommentService from "../service/comment.service";

@Resolver()
export default class CommentResolver {
  constructor(private comment: CommentService) {
    this.comment = new CommentService();
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async addComment(
    @Arg("input") input: CommentInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.comment.addComment(input, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async deleteComment(
    @Arg("commentId") commentId: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.comment.deleteComment(commentId, ctx);
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async replyToComment(
    @Arg("input") input: CommentInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.comment.replyToComment(input, ctx);
  }
}
