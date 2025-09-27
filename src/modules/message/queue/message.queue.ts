import { Queue } from "bullmq";
import { QueueNames } from "../../../utils/queue";
import { RedisClient } from "../../../utils/redis";

interface MessageQueueData {
  messageId: string;
  senderId: string;
  receiverId: string;
}

// Create a BullMQ queue for message jobs
export const messageQueue = new Queue<MessageQueueData>(QueueNames.chatQueue, {
  connection: RedisClient.getNormal(), // Use your Redis connection
  defaultJobOptions: {
    attempts: 2, // Retry up to 2 times if sending fails
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true, // Remove job from the queue once done
    removeOnFail: false, // Keep failed jobs for monitoring
  },
});
