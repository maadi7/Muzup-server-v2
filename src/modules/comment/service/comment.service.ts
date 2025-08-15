import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { CommentInput } from "../interface/comment.input";
import { CommentModel } from "../schema/comment.schema";
import { PostModel } from "../../post/schema/post.schema";

class CommentService {
  async addComment(input: CommentInput, ctx: Context): Promise<boolean> {
    try {
      const post = await PostModel.findById(input.postId);
      if (!post) throw new ErrorWithProps("Post not found", { code: 404 });

      await CommentModel.create({
        postId: input.postId,
        userId: ctx.user,
        parentId: input.parentId || null,
        replyToUserId: input.replyToUserId || null,
        content: input.content,
        // storing tagged user IDs for later use
        taggedUserIds: input.taggedUserIds || [],
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(commentId: string, ctx: Context): Promise<boolean> {
    try {
      const comment = await CommentModel.findById(commentId);
      if (!comment)
        throw new ErrorWithProps("Comment not found", { code: 404 });

      if (comment.userId.toString() !== ctx.user.toString()) {
        throw new ErrorWithProps("Unauthorized", { code: 403 });
      }

      await CommentModel.findByIdAndDelete(commentId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async replyToComment(input: CommentInput, ctx: Context): Promise<boolean> {
    try {
      const parentComment = await CommentModel.findById(input.parentId);
      if (!parentComment)
        throw new ErrorWithProps("Parent comment not found", { code: 404 });

      await CommentModel.create({
        postId: input.postId,
        userId: ctx.user,
        parentId: input.parentId,
        replyToUserId: input.replyToUserId || parentComment.userId,
        content: input.content,
        taggedUserIds: input.taggedUserIds || [],
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default CommentService;
