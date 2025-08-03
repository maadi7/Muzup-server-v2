import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { isProduction } from "../utils/helper";

type TRequestLogData = {
  timestamp: string;
  response: {
    statusCode: number;
    responseTime: number;
  };
  request: {
    method: string;
    url: string;
    ip: string;
    name?: string;
    variables?: string;
  };
};

type TErrorLogData = {
  timestamp: string;
  error: {
    message?: string;
    stack?: {};
  };
};

/**
 * Extracts and structures the request log data from the Fastify request and reply objects.
 *
 * @param {FastifyRequest} request - The Fastify request object
 * @param {FastifyReply} reply - The Fastify reply object
 * @returns {TRequestLogData} - The structured request log data
 */
export const getRequestLogData = (
  request: FastifyRequest,
  reply: FastifyReply
): TRequestLogData => {
  let logData: TRequestLogData = {
    timestamp: new Date().toISOString(),
    response: {
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime, // Fastify provides response time automatically
    },
    request: {
      method: request.method,
      url: request.url,
      ip: request.ip,
    },
  };

  if (
    request.routeOptions.url === "/graphql" &&
    Object.keys(request.body ?? {}).includes("query") &&
    Object.keys(request.body ?? {}).includes("operationName")
  ) {
    const operationName = (request.body as any)["operationName"] ?? "";
    const operationVariables = (request.body as any)["variables"] ?? {};

    return {
      ...logData,
      request: {
        ...logData.request,
        name: operationName,
        variables: operationVariables,
      },
    };
  }

  return logData;
};

/**
 * Extracts and structures error log data for easier readability and tracking.
 *
 * @param {any} error - The error object to be logged
 * @returns {TErrorLogData} - The structured error log data
 */
export const getErrorLogData = (error: any): TErrorLogData => {
  return {
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message,
      stack: !isProduction ? error?.stack : null, // Uncomment if stack trace is needed
    },
  };
};
