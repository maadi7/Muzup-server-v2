/**
 * @fileoverview
 * Singleton class for managing Socket.IO server instance
 */

import { Server } from "socket.io";
import http from "http";
import { logger } from "../log/logger";
import { RedisClient } from "./redis";

export class SocketServer {
  private static io: Server | null = null;

  /**
   * Initialize Socket.IO server (only once)
   * @param server - HTTP server instance
   */
  public static init(server: http.Server): Server {
    if (!SocketServer.io) {
      SocketServer.io = new Server(server, {
        cors: {
          origin: "*", // change to your frontend domain later
        },
      });
      const redis = RedisClient.getNormal(); // for set/get
      const redisSub = RedisClient.getSubscriber(); // for subscribe

      // Subscribe to channel
      redisSub.subscribe("notifications", (err, count) => {
        if (err) {
          logger.error("Failed to subscribe to notifications channel", err);
        } else {
          logger.info(
            `Subscribed to notifications channel (${count} total subscriptions)`
          );
        }
      });

      // Handle published messages
      redisSub.on("message", (channel: string, message: string) => {
        try {
          if (channel === "notifications") {
            const { receiver, event, data } = JSON.parse(message);
            SocketServer.emitToUser(receiver, event, data);
          }
        } catch (err) {
          logger.error("Failed to parse pubsub message", err);
        }
      });

      // Listen for client connections
      SocketServer.io.on("connection", (socket) => {
        logger.info(`⚡️ New client connected: ${socket.id}`);
        socket.on("register", async (userId: string) => {
          await redis.set(`socket:${userId}`, socket.id);
        });

        // Example: join user-specific room
        socket.on("join", (userId: string) => {
          socket.join(`user:${userId}`);
          logger.info(`User ${userId} joined their room`);
        });

        // Disconnect
        socket.on("disconnect", () => {
          logger.info(`❌ Client disconnected: ${socket.id}`);
        });
      });

      logger.info("✅ Socket.IO server initialized");
    }

    return SocketServer.io;
  }

  /**
   * Get existing Socket.IO instance
   */
  public static getIO(): Server {
    if (!SocketServer.io) {
      throw new Error("Socket.IO not initialized. Call init() first.");
    }
    return SocketServer.io;
  }

  /**
   * Emit event to a specific user room
   */
  public static async emitToUser(userId: string, event: string, data: any) {
    if (!SocketServer.io) return;
    const redis = RedisClient.getNormal();
    const id = await redis.get(`socket:${userId}`);
    console.log(id);
    SocketServer.io.to(id).emit(event, data);
  }
}
//1t3J__Ka1uVRY22-AAAP
// OYTcvlAbhmGbfUNTAAAS
