import { MiddlewareFn } from "type-graphql";
import { GraphQLError as ApolloError } from "graphql";
import Context from "../interface/context";
import { ErrorWithProps } from "mercurius";

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.user) {
    throw new ErrorWithProps(
      "You are not authenticated to perform any action, please try again!"
    );
  }
  return await next();
};
