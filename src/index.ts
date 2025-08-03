import dotenv from "dotenv";
import "dotenv/config";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { makeExecutableSchema } from "@graphql-tools/schema";
import Fastify from "fastify";
import mercurius, { ErrorWithProps, MercuriusError } from "mercurius";
import "reflect-metadata";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { resolvers as typedResolvers } from "./resolvers/index.resolver";
import { CookieKeys } from "./utils/cookie";
import { connectToMongoDb } from "./utils/dbConnection";
import { EnvVars } from "./utils/environment";
import { isProduction } from "./utils/helper";
import { logger } from "./log/logger";
import { verifyUser } from "./utils/jwt";
import Context from "./interface/context";

// Init DotEnv
dotenv.config();

// Init Fastify App
const app = Fastify({
  logger: false,
});

// Bootstraping server
async function startServer() {
  try {
    // MongoDB Connection
    await connectToMongoDb();

    // Build typedefs and resolvers for all our modules
    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
      resolvers: typedResolvers,
    });

    // Make a schema file from the typedefs and resolver
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // Register helmet plugin
    await app.register(helmet, { contentSecurityPolicy: isProduction });

    // Register CORS plugin
    await app.register(cors, {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5000",
        "http://localhost:8000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    });

    // Register cookie plugin
    await app.register(cookie, {
      secret: EnvVars.values.COOKIE_SECRET,
      parseOptions: {},
    });

    // Mercurius setup for graphql
    app.register(mercurius, {
      schema,
      queryDepth: 7,
      graphiql: true,
      context: async (request, reply) => {
        const context: Context = {
          req: request,
          rep: reply,
          userType: undefined,
          user: undefined,
        };

        const cookie = request.cookies;
        const accessToken = cookie[CookieKeys.ACCESS_TOKEN];
        const refreshToken = cookie[CookieKeys.REFRESH_TOKEN];
        const uniqueId = cookie[CookieKeys.UNIQUE_ID];

        if (accessToken && refreshToken && uniqueId) {
          const user = await verifyUser(uniqueId);
          if (user !== null) {
            context.user = user._id.toString();
            context.userType = user.type;
          }
        }

        return context;
      },
      errorFormatter: (result, context) => {
        const err = result.errors[0].originalError instanceof ErrorWithProps;
        let message = "Something went wrong, please try again";
        let status = 200;

        console.log(result.errors[0].originalError.message);

        if (err) {
          console.log(err);
          const error = result.errors[0].originalError as MercuriusError;
          message = error.message ?? "Something went wrong, please try again";
          status = error.statusCode ?? 200;
        }

        return {
          statusCode: status,
          response: {
            data: null,
            errors: [{ message }],
          },
        };
      },
    });

    // Register routes
    app.get("/", async (req, res) => {
      res.status(200).send(`Healthcheck Working`);
    });

    app.setErrorHandler(function (error, request, reply) {
      reply.send(error);
    });

    await app.listen({ port: 4000, host: "0.0.0.0" });
    logger.info(`Server started on http://localhost:${process.env.PORT} 🚀`);
  } catch (error: any) {
    console.error(error.message);
  }
}

startServer();
