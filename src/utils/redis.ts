import { Redis } from "ioredis";
import { logger } from "../log/logger";
import { EnvVars } from "./environment";

const redisClient =
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

redisClient.on("error", (err) => logger.error("Redis Client Error", err));
redisClient.on("connect", () => logger.info("Redis Connected"));

class RedisKeys {
  // Master Keys
  // static readonly M_STATES_KEY = "choose:states";
  // static readonly M_CUISINES_KEY = "choose:cuisines";
  // static readonly M_TIMEZONES_KEY = "choose:timezones";
  // static readonly M_PERMISSIONS_KEY = "choose:userPermissions";
  // static readonly M_CONFIGS_KEY = "choose:systemConfigs";
  // static readonly M_ITEM_OPTIONS_KEY = "choose:itemOptions";
  // // Exp Time in Seconds
  // static readonly EXP_TIME = 86400 * 7; // (86400 = 1 Day) * 7 = 7 Days
  // // Rate Limit Key
  // static readonly RL_KEY = "rate_limit";
  // // TOTP Secret Key
  // static readonly TOTP_KEY = "totp_secret";
}

export { redisClient, RedisKeys };
