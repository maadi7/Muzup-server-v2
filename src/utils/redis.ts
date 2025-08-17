/**
 * @fileoverview
 * This file contains a signleton class for implementation of redis connection
 */

import { Cluster, Redis } from "ioredis";
import { EnvVars } from "./environment";
import { logger } from "../log/logger";
import { getErrorLogData } from "../log/utils";

export class RedisClient {
  private static instance: Cluster | Redis | null = null;

  // Singleton pattern to ensure only one instance of the Redis connection exists
  public static getInstance(): Cluster | Redis {
    if (!RedisClient.instance) {
      RedisClient.instance =
        EnvVars.values.REDIS_TLS === "true"
          ? new Redis.Cluster(
              [
                {
                  host: EnvVars.values.REDIS_HOST,
                  port: parseInt(EnvVars.values.REDIS_PORT) ?? 6379,
                },
              ],
              {
                dnsLookup: (address, callback) => callback(null, address),
                slotsRefreshTimeout: 2000,
                redisOptions: {
                  maxRetriesPerRequest: null,
                  tls: {},
                },
              }
            )
          : new Redis({
              host: EnvVars.values.REDIS_HOST,
              port: parseInt(EnvVars.values.REDIS_PORT) ?? 6379,
              maxRetriesPerRequest: null,
            });

      RedisClient.instance.on("connect", () => {
        logger.info("Redis Connected!");
      });

      RedisClient.instance.on("error", (err) => {
        logger.error(
          "Error connection to MongoDB database",
          getErrorLogData(err)
        );
      });
    }
    return RedisClient.instance;
  }
}
