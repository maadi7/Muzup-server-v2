import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { User, UserModel } from "../schema/user.schema";
import { maskEmail } from "../../../utils/helper";
import { UserSignInInput, UserToken } from "../interface/user.input";
import {
  CookieKeys,
  getServerCookie,
  setServerCookie,
} from "../../../utils/cookie";
import { UserType } from "../interface/user.enum";

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
}

export default UserService;
