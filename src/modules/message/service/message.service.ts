import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";

import { User, UserModel } from "../../user/schema/user.schema";

import { SocketServer } from "../../../utils/socket";
import { RedisClient } from "../../../utils/redis";
import { ConversationModel } from "../../conversation/schema/conversation.schema";
import { MessageModel, MessageStatusEnum } from "../schema/message.schema";
import { messageQueue } from "../queue/message.queue";

class MessageService {
  async sendMessage(
    receiverId: string,
    text: string,
    ctx: Context
  ): Promise<boolean> {
    // 1. Validate receiver
    try {
      const receiver = await UserModel.findById(receiverId);
      if (!receiver) throw new ErrorWithProps("No user found!", { code: 404 });

      // Just create the message doc (fast)
      const message = await MessageModel.create({
        sender: ctx.user,
        text,
        status: [{ user: ctx.user, state: MessageStatusEnum.SENT }],
      });

      // Push job into queue
      await messageQueue.add("sendMessageJob", {
        messageId: message._id.toString(),
        senderId: ctx.user,
        receiverId,
      });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateMessageStatus(
    conversationId: string,
    messageId: string,
    newState: MessageStatusEnum,
    ctx: Context
  ): Promise<boolean> {
    const readerId = ctx.user; // current user opening the chat
    const io = SocketServer.getIO();
    const redis = RedisClient.getNormal();
    // 1. Fetch the message
    const messageDoc = await MessageModel.findById(messageId);
    if (!messageDoc) throw new Error("Message not found");

    // 2. Only update status if the reader is the receiver
    // For 1-1, the sender is messageDoc.sender, so reader != sender
    if (readerId !== messageDoc.sender.toString()) {
      messageDoc.status = newState as MessageStatusEnum;
      await messageDoc.save();
    }

    // 3. Update conversation unreadCount
    const conversation = await ConversationModel.findById(
      conversationId
    ).populate("participants");
    if (!conversation) throw new Error("Conversation not found");

    // mark all messages as read for this reader
    conversation.unreadCount.set(readerId, 0);
    await conversation.save();

    // 4. Notify the sender via socket
    const senderId = messageDoc.sender.toString();
    if (senderId !== readerId) {
      const senderSocketId = await redis.get(`socket:${senderId}`);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageStatusUpdate", {
          conversationId,
          messageId,
          newState,
        });
      }
    }

    return true;
  }
}

export default MessageService;
