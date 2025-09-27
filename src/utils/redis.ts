import { Cluster, Redis } from "ioredis";
import { EnvVars } from "./environment";
import { logger } from "../log/logger";
import { getErrorLogData } from "../log/utils";

export class RedisClient {
  private static normalInstance: Cluster | Redis | null = null;
  private static subscriberInstance: Cluster | Redis | null = null;

  /** Normal Redis instance for get/set/del */
  public static getNormal(): Cluster | Redis {
    if (!RedisClient.normalInstance) {
      RedisClient.normalInstance =
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
                redisOptions: { maxRetriesPerRequest: null, tls: {} },
              }
            )
          : new Redis({
              host: EnvVars.values.REDIS_HOST,
              port: parseInt(EnvVars.values.REDIS_PORT) ?? 6379,
              maxRetriesPerRequest: null,
            });

      RedisClient.normalInstance.on("connect", () => {
        logger.info("Redis Normal Connected!");
      });
      RedisClient.normalInstance.on("error", (err) => {
        logger.error("Redis Normal Error", getErrorLogData(err));
      });
    }
    return RedisClient.normalInstance;
  }

  /** Subscriber Redis instance for pub/sub */
  public static getSubscriber(): Cluster | Redis {
    if (!RedisClient.subscriberInstance) {
      RedisClient.subscriberInstance =
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
                redisOptions: { maxRetriesPerRequest: null, tls: {} },
              }
            )
          : new Redis({
              host: EnvVars.values.REDIS_HOST,
              port: parseInt(EnvVars.values.REDIS_PORT) ?? 6379,
              maxRetriesPerRequest: null,
            });

      RedisClient.subscriberInstance.on("connect", () => {
        logger.info("Redis Subscriber Connected!");
      });
      RedisClient.subscriberInstance.on("error", (err) => {
        logger.error("Redis Subscriber Error", getErrorLogData(err));
      });
    }
    return RedisClient.subscriberInstance;
  }
}
