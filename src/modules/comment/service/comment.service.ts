import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { CommentInput } from "../interface/comment.input";
import { Comment, CommentModel } from "../schema/comment.schema";
import { PostModel } from "../../post/schema/post.schema";
import { RepliesResponse } from "../interface/comment.type";

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

  async getComments(postId: string, page: number = 1): Promise<Comment[]> {
    try {
      const limit = 10;
      const post = await PostModel.findById(postId);
      if (!post) throw new ErrorWithProps("Post not found", { code: 404 });

      const skip = (page - 1) * limit;

      // Fetch comments (only top-level ones here)
      const comments = await CommentModel.find({ postId, parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username profilePic") // fetch basic user info
        .lean();

      const totalCount = await CommentModel.countDocuments({
        postId,
        parentId: null,
      });

      return comments;
    } catch (error) {
      throw error;
    }
  }

  async getReplies(
    parentId: string,
    page: number = 1
  ): Promise<RepliesResponse> {
    try {
      const limit = 10;
      const parentComment = await CommentModel.findById(parentId);
      if (!parentComment) {
        throw new ErrorWithProps("Parent comment not found", { code: 404 });
      }

      const skip = (page - 1) * limit;

      // Fetch replies for that parent
      const comments = await CommentModel.find({ parentId })
        .sort({ createdAt: 1 }) // oldest first for replies (like IG), change to -1 if you want newest first
        .skip(skip)
        .limit(limit)
        .populate("userId", "username profilePic")
        .populate("replyToUserId", "username") // optional: show who is being replied to
        .lean();

      const totalCount = await CommentModel.countDocuments({ parentId });

      return {
        comments,
        hasMore: skip + comments.length < totalCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default CommentService;
