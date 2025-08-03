import Context from "../interface/context";
import { isProduction } from "./helper";

export class CookieKeys {
  // Master Keys
  static readonly ACCESS_TOKEN = "spotifyAccessToken";
  static readonly REFRESH_TOKEN = "spotifyRefreshToken";
  static readonly UNIQUE_ID = "uniqueId";
}

export const getServerCookie = (cookieKey: string, ctx: Context): string => {
  const cookie = ctx.req.cookies;
  return cookie[cookieKey];
};

export const setServerCookie = (
  cookieKey: string,
  cookieValue: string,
  ctx: Context
) => {
  if (isProduction) {
    ctx.rep.setCookie(cookieKey, cookieValue, {
      maxAge: 3.154e10,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: `.muzup.com`,
      path: "/",
    });
  } else {
    const res = ctx.rep.setCookie(cookieKey, cookieValue, {
      maxAge: 3.154e10,
      httpOnly: true,
    });
  }
};

export const clearServerCookie = (cookieKey: string, ctx: Context) => {
  if (isProduction) {
    ctx.rep.clearCookie(cookieKey, {
      maxAge: 3.154e10,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: `.muzup.com`,
      path: "/",
    });
  } else {
    ctx.rep.clearCookie(cookieKey, {
      maxAge: 3.154e10,
      httpOnly: true,
    });
  }
};
