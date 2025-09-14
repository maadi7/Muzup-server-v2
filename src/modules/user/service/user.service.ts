import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { User, UserModel } from "../schema/user.schema";
import { maskEmail } from "../../../utils/helper";
import {
  UserProfileInfo,
  UserProfileInput,
  UserSignInInput,
  UserToken,
} from "../interface/user.input";
import {
  CookieKeys,
  getServerCookie,
  setServerCookie,
} from "../../../utils/cookie";
import { RequestStatus, UserType } from "../interface/user.enum";
import {
  FriendReqeust,
  FriendReqeustModal,
} from "../schema/friend-request.schema";
import { PostModel } from "../../post/schema/post.schema";
import mongoose from "mongoose";

class UserService {
  async meUser(ctx: Context): Promise<User> {
    try {
      const me = await UserModel.findOne({ _id: ctx.user }).lean<User>();

      if (!me) {
        return null;
      }

      return { ...me, email: maskEmail(me.email) };
    } catch (error) {
      throw error;
    }
  }

  async fetchFriendStatus(id: string, ctx: Context): Promise<RequestStatus> {
    try {
      const friendRequest = await FriendReqeustModal.findOne({
        senderId: ctx.user,
        recieverId: id,
      })
        .select("status")
        .lean();

      if (!friendRequest) {
        return null;
      }

      return friendRequest.status;
    } catch (error) {
      throw error;
    }
  }
  async checkById(id: string, ctx: Context): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ spotifyId: id })
        .select("_id spotifyAccessToken spotifyRefreshToken")
        .lean();
      if (!user) {
        return false;
      }
      setServerCookie(CookieKeys.ACCESS_TOKEN, user.spotifyAccessToken, ctx);
      setServerCookie(CookieKeys.REFRESH_TOKEN, user.spotifyRefreshToken, ctx);
      setServerCookie(CookieKeys.UNIQUE_ID, user._id.toString(), ctx);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async saveUserTokens(input: UserToken, ctx: Context): Promise<boolean> {
    try {
      const { aToken, rToken, email, spotyifyId } = input;

      if (!aToken || !rToken || !email) {
        throw new ErrorWithProps("Invalid token data", {
          statusCode: 400,
        });
      }

      const user = await UserModel.create({
        spotifyAccessToken: aToken,
        spotifyRefreshToken: rToken,
        email: email,
        spotifyId: spotyifyId,
        isProfileCompleted: false,
      });

      if (!user) {
        throw new ErrorWithProps("Something went wrong, please try again");
      }

      setServerCookie(CookieKeys.ACCESS_TOKEN, aToken, ctx);
      setServerCookie(CookieKeys.REFRESH_TOKEN, rToken, ctx);
      setServerCookie(CookieKeys.UNIQUE_ID, user._id.toString(), ctx);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async userSingIn(input: UserSignInInput, ctx: Context): Promise<boolean> {
    try {
      const {
        InstaId,
        dob,
        firstName,
        lastName,
        profilePic,
        username,
        isArtist,
        aToken,
        rToken,
        spotyifyId,
        email,
      } = input;

      if (!aToken || !rToken || !email) {
        throw new ErrorWithProps("Invalid token data", {
          statusCode: 400,
        });
      }

      // 1. Validate instaId only if user is an artist
      if (isArtist && !InstaId) {
        throw new ErrorWithProps("Instagram ID is required for artists", {
          statusCode: 400,
        });
      }

      // 2. Check if the username already exists
      const existingUser = await UserModel.findOne({ username });

      if (existingUser) {
        throw new ErrorWithProps("Username already taken", {
          statusCode: 409,
        });
      }

      const user = await UserModel.create({
        spotifyAccessToken: aToken,
        spotifyRefreshToken: rToken,
        email: email,
        spotifyId: spotyifyId,
        username,
        dob,
        firstName,
        lastName,
        profilePic,
        isArtist,
        instaId: isArtist ? InstaId : null,
        isProfileCompleted: true,
        type: isArtist ? UserType.Artist : UserType.User,
      });

      if (!user) {
        throw new ErrorWithProps("Something went wrong, please try again");
      }

      setServerCookie(CookieKeys.ACCESS_TOKEN, aToken, ctx);
      setServerCookie(CookieKeys.REFRESH_TOKEN, rToken, ctx);
      setServerCookie(CookieKeys.UNIQUE_ID, user._id.toString(), ctx);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async editProfile(input: UserProfileInput, ctx: Context): Promise<boolean> {
    try {
      const user = await UserModel.findById(ctx.user);
      if (!user) {
        throw new ErrorWithProps("Something went wrong, please try again");
      }
      await UserModel.findByIdAndUpdate({ _id: ctx.user }, input);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      if (!query || query.trim() === "") {
        return [];
      }

      const regex = new RegExp(query, "i"); // case-insensitive partial match

      const users = await UserModel.find({
        $or: [{ username: regex }, { firstName: regex }, { lastName: regex }],
      })
        .select("_id username firstName lastName profilePic type") // select only what you need
        .lean<User[]>();

      return users;
    } catch (error) {
      throw error;
    }
  }

  async sendRequest(id: string, ctx: Context): Promise<boolean> {
    try {
      if (!ctx.user) {
        throw new ErrorWithProps("Unauthorized", { statusCode: 401 });
      }

      if (ctx.user.toString() === id.toString()) {
        throw new ErrorWithProps("You cannot send a request to yourself", {
          statusCode: 400,
        });
      }

      const user = await UserModel.findById(id)
        .select("isPrivate followings followers")
        .lean<User>();

      if (!user) {
        throw new ErrorWithProps("User doesn't exist", { statusCode: 404 });
      }

      if (user.isPrivate) {
        // Private profile — create a pending request
        await FriendReqeustModal.create({
          senderId: ctx.user,
          recieverId: id,
          status: RequestStatus.Pending,
        });
      } else {
        // Public profile — directly follow
        await FriendReqeustModal.create({
          senderId: ctx.user,
          recieverId: id,
          status: RequestStatus.Accepted,
        });
        await Promise.all([
          UserModel.updateOne(
            { _id: ctx.user, followings: { $ne: id } }, // ensure no duplicates
            { $push: { followings: id } }
          ),
          UserModel.updateOne(
            { _id: id, followers: { $ne: ctx.user } }, // ensure no duplicates
            { $push: { followers: ctx.user } }
          ),
        ]);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async acceptRequest(id: string, ctx: Context): Promise<boolean> {
    try {
      if (!ctx.user) {
        throw new ErrorWithProps("Unauthorized", { statusCode: 401 });
      }

      if (ctx.user.toString() === id.toString()) {
        throw new ErrorWithProps("You cannot accept a request from yourself", {
          statusCode: 400,
        });
      }

      const sender = await UserModel.findById(id).select("_id");
      if (!sender) {
        throw new ErrorWithProps("User doesn't exist", { statusCode: 404 });
      }

      // Check if pending request exists
      const request = await FriendReqeustModal.findOne({
        senderId: id,
        recieverId: ctx.user,
        status: RequestStatus.Pending,
      });

      if (!request) {
        throw new ErrorWithProps("No pending request found", {
          statusCode: 400,
        });
      }

      // Delete the request
      await FriendReqeustModal.deleteOne({
        senderId: id,
        recieverId: ctx.user,
        status: RequestStatus.Pending,
      });

      // Add to followers/followings
      await Promise.all([
        UserModel.updateOne(
          { _id: ctx.user, followers: { $ne: id } },
          { $push: { followers: id } }
        ),
        UserModel.updateOne(
          { _id: id, followings: { $ne: ctx.user } },
          { $push: { followings: ctx.user } }
        ),
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  }
  async deleteRequest(id: string, ctx: Context): Promise<boolean> {
    try {
      if (ctx.user.toString() === id.toString()) {
        throw new ErrorWithProps("You cannot unfollow yourself", {
          statusCode: 400,
        });
      }

      const sender = await UserModel.findById(id).select("_id");
      if (!sender) {
        throw new ErrorWithProps("User doesn't exist", { statusCode: 404 });
      }

      // Delete the request
      await FriendReqeustModal.deleteOne({
        senderId: ctx.user,
        recieverId: id,
      });

      // remove from followers/followings
      await Promise.all([
        UserModel.updateOne(
          { _id: ctx.user, followers: { $ne: id } },
          { $pull: { followers: id } }
        ),
        UserModel.updateOne(
          { _id: id, followings: { $ne: ctx.user } },
          { $pull: { followings: ctx.user } }
        ),
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(id: string, ctx: Context): Promise<boolean> {
    try {
      const res = await UserModel.findById(id);

      if (!res) {
        throw new ErrorWithProps("User doesn't exists");
      }

      if (ctx.user.toString() === id.toString()) {
        throw new ErrorWithProps("You cannot block yourself", {
          statusCode: 400,
        });
      }

      await UserModel.updateOne(
        { _id: ctx.user, blockedByMe: { $ne: id } },
        { $push: { blockedByMe: id } }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfileInfo(
    id: string,
    ctx: Context,
    page: number = 1,
    limit: number = 10
  ): Promise<UserProfileInfo> {
    const user = await UserModel.findById(id).lean();
    if (!user) throw new ErrorWithProps("User not found!");

    const skip = (page - 1) * limit;

    // Count total posts for pagination
    const totalCount = await PostModel.countDocuments({ user: id });

    // Aggregate with lookup for comments
    const posts = await PostModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
            { $count: "count" },
          ],
          as: "commentsCount",
        },
      },
      {
        $addFields: {
          commentsCount: {
            $ifNull: [{ $arrayElemAt: ["$commentsCount.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          postUrl: 1,
          waveUrl: 1,
          createdAt: 1,
          reactionsCount: { $size: "$reactions" },
          commentsCount: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profilePic: user.profilePic,
      followersCount: user.followers?.length || 0,
      followingsCount: user.followings?.length || 0,
      isPrivate: user.isPrivate,
      posts: {
        posts,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}

export default UserService;
