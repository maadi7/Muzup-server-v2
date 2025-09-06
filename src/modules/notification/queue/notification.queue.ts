import { Queue } from "bullmq";
import { QueueNames } from "../../../utils/queue";
import { RedisClient } from "../../../utils/redis";
import {
  NotificationEntityType,
  NotificationType,
} from "../schema/notification.schema";

const redisClient = RedisClient.getInstance();

// Define queue data interface
export interface NotificationQueueData {
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId?: string;
  receiver: string;
  sender: string;
  metadata?: Record<string, any>;
}

// Create a BullMQ queue for activity logs
export const notificationQueue = new Queue<NotificationQueueData>(
  QueueNames.notificationQueue,
  {
    connection: redisClient,
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
    },
  }
);
