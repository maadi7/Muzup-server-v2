import dotenv from "dotenv";
import { createLogger, format, transports } from "winston";
import { isProduction } from "../utils/helper";

// Init .env
dotenv.config();

// Log levels configuration
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
};

/**
 * Create a logger instance with different transports for different environments.
 *
 * @returns {winston.Logger} Configured Winston logger
 */
const buildLogger = () => {
  const loggerTransports = [new transports.Console()];

  // Format for logs: JSON in production, simple in development
  const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // Capture stack trace
    format.splat(),
    format.json()
  );

  // Add console transport for development or staging
  // if (!isProduction) {
  //   loggerTransports.push(new transports.Console());
  // }

  // const axiomTransport = new AxiomTransport({
  //   dataset: EnvVars.values.AXIOM_DATASET, // Name of the Axiom dataset
  //   token: EnvVars.values.AXIOM_TOKEN, // Axiom API token
  //   orgId: EnvVars.values.AXIOM_ORG_ID, // Axiom Organization ID
  // });

  // // Add Axiom transport for production
  // if (
  //   isProduction &&
  //   EnvVars.values.AXIOM_LOGGING === "yes" &&
  //   EnvVars.values.AXIOM_TOKEN
  // ) {
  //   loggerTransports.push(axiomTransport);
  // }

  // Create and return the logger instance
  const logger = createLogger({
    levels: logLevels.levels,
    level: isProduction ? "info" : "debug", // Log level based on environment
    format: logFormat,
    transports: loggerTransports,
    exitOnError: false, // Do not exit on handled exceptions
  });

  // Handle exceptions & rejections
  if (isProduction) {
    logger.exceptions.handle(new transports.Console());

    logger.rejections.handle(new transports.Console());
  }

  return logger;
};

export const logger = buildLogger();
