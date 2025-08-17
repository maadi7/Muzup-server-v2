import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { PostInput } from "../interface/post.input";
import { Post, PostModel } from "../schema/post.schema";
import { User, UserModel } from "../../user/schema/user.schema";

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

  async getTimelinePosts(
    ctx: Context,
    page: number = 1,
    limit: number = 20
  ): Promise<Post[]> {
    try {
      const currentUser = await UserModel.findById(ctx.user).select(
        "followings"
      );
      if (!currentUser) {
        throw new ErrorWithProps("User not found", { code: 404 });
      }

      const followingIds = currentUser.followings || [];
      const userIds = [ctx.user, ...followingIds];

      // Get total count for pagination
      const totalCount = await PostModel.countDocuments({
        user: { $in: userIds },
      });

      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;

      // Fetch paginated posts
      const posts = await PostModel.find({
        user: { $in: userIds },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<Post[]>();

      return posts;
    } catch (error) {
      throw new ErrorWithProps("Failed to fetch timeline posts", { error });
    }
  }

  async getPostById(id: string, ctx: Context): Promise<Post> {
    try {
      const post = await PostModel.findById(id).populate({
        path: "user",
        select: "isPrivate followings username profilePic",
      });

      if (!post) {
        throw new ErrorWithProps("Post not found", { code: 404 });
      }

      const populatedUser = post.user as User;

      // Check if the post owner's profile is private
      if (populatedUser.isPrivate) {
        const isOwner = populatedUser._id.toString() === ctx.user.toString();
        const isFollowedByOwner = populatedUser?.followings.includes(
          ctx.user.toString()
        );

        if (!isOwner && !isFollowedByOwner) {
          throw new ErrorWithProps(
            "Access denied: This post is from a private account",
            { code: 403 }
          );
        }
      }

      return post;
    } catch (error) {
      throw error;
    }
  }
}

export default PostService;
