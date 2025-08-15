import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { PostInput } from "../interface/post.input";
import { PostModel } from "../schema/post.schema";

class PostService {
  async createPost(input: PostInput, ctx: Context): Promise<boolean> {
    try {
      await PostModel.create({
        ...input,
        user: ctx.user,
      });
      return true;
    } catch (error) {
      throw new ErrorWithProps("Failed to create post", { error });
    }
  }

  async deletePost(postId: string, ctx: Context): Promise<boolean> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new ErrorWithProps("Post not found", { code: 404 });

      if (post.user.toString() !== ctx.user.toString()) {
        throw new ErrorWithProps("Unauthorized", { code: 403 });
      }

      await PostModel.findByIdAndDelete(postId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async addReaction(
    postId: string,
    emoji: string,
    ctx: Context
  ): Promise<boolean> {
    try {
      const post = await PostModel.findById(postId).populate("reactions.users");
      if (!post) throw new ErrorWithProps("Post not found", { code: 404 });

      let reaction = post.reactions.find((r) => r.emoji === emoji);

      if (reaction) {
        // Avoid duplicates
        if (!reaction.users.some((u) => u.toString() === ctx.user.toString())) {
          reaction.users.push(ctx.user as any);
        }
      } else {
        post.reactions.push({
          emoji,
          users: [ctx.user as any],
        });
      }

      await post.save();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeReaction(
    postId: string,
    emoji: string,
    ctx: Context
  ): Promise<boolean> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new ErrorWithProps("Post not found", { code: 404 });

      const reactionIndex = post.reactions.findIndex((r) => r.emoji === emoji);
      if (reactionIndex !== -1) {
        post.reactions[reactionIndex].users = post.reactions[
          reactionIndex
        ].users.filter((u) => u.toString() !== ctx.user.toString());

        // Remove empty reaction
        if (post.reactions[reactionIndex].users.length === 0) {
          post.reactions.splice(reactionIndex, 1);
        }
      }

      await post.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default PostService;
