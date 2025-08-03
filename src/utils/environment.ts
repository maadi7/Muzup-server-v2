/**
 * @fileoverview
 * This file exports a typesafe class implemented using Zod to access environment variables.
 */

import dotenv from "dotenv";
import { z } from "zod";

// Load .env file based on NODE_ENV, defaulting to `.env.development` if not specified
const envFile = `.env`;
dotenv.config({ path: envFile });

/**
 * Zod schema to define the types for environment variables
 */
const zodEnvSchema = z.object({
  // DB Connections
  DB_URI: z.string().min(1, "DB_URI is not present"),
  REDIS_HOST: z.string().min(1, "REDIS_HOST is not present"),
  REDIS_PORT: z.string().min(1, "REDIS_PORT is not present"),
  REDIS_TLS: z.string().min(1, "REDIS_TLS is not present"),

  // Secrets & Keys
  COOKIE_SECRET: z.string().min(1, "COOKIE_SECRET is not present"),

  // Application Config
  APP_URL: z
    .string()
    .min(1, "APP_URL is not present")
    .url("APP_URL is not a valid URL"),
  SERVER_URL: z
    .string()
    .min(1, "SERVER_URL is not present")
    .url("SERVER_URL is not a valid URL"),

  // Cloudinary Config
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, "CLOUDINARY_CLOUD_NAME is not present"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is not present"),
  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, "CLOUDINARY_API_SECRET is not present"),

  SERVER_ENV: z.string().min(1, "SERVER_ENV is not present"),
});

type TEnv = z.infer<typeof zodEnvSchema>;

export class EnvVars {
  private static envVars: TEnv | null = null;

  /**
   * Initializes and validates environment variables immediately at application startup.
   */
  public static initialize(): void {
    if (!this.envVars) {
      try {
        this.envVars = this.loadAndValidateEnvVars();
      } catch (error: any) {
        console.error("Environment Variables Error", {
          error: { message: error.errors ? error.errors : error.toString() },
        });
        process.exit(1); // Exit if the environment variables are invalid
      }
    }
  }

  /**
   * Provides access to validated environment variables.
   * @returns TEnv - the validated environment variables
   */
  public static get values(): TEnv {
    if (!this.envVars) {
      throw new Error(
        "Environment variables are not initialized. Please call EnvVars.initialize() at startup."
      );
    }
    return this.envVars;
  }

  /**
   * Loads and validates environment variables based on the Zod schema.
   * @returns TEnv - validated environment variables
   */
  private static loadAndValidateEnvVars(): TEnv {
    return zodEnvSchema.parse({
      // DB Connections
      DB_URI: process.env.DB_URI ?? "",
      REDIS_HOST: process.env.REDIS_HOST ?? "",
      REDIS_PORT: process.env.REDIS_PORT ?? "",
      REDIS_TLS: process.env.REDIS_TLS ?? "",

      COOKIE_SECRET: process.env.COOKIE_SECRET ?? "",

      // Application Config
      APP_URL: process.env.APP_URL ?? "",
      SERVER_URL: process.env.SERVER_URL ?? "",

      // Cloudinary Config
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",

      SERVER_ENV: process.env.SERVER_ENV ?? "",
    });
  }
}

// Initialize environment variables at the beginning of the application
EnvVars.initialize();
