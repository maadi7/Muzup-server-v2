import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";

import { User, UserModel } from "../../user/schema/user.schema";

import { SocketServer } from "../../../utils/socket";
import { RedisClient } from "../../../utils/redis";
import { ConversationModel } from "../../conversation/schema/conversation.schema";
import { MessageModel, MessageStatusEnum } from "../schema/message.schema";

class MessageService {
  public static io = SocketServer.getIO();
  public static redis = RedisClient.getInstance();

  async sendMessage(
    receiverId: string,
    text: string,
    ctx: Context
  ): Promise<boolean> {
    // 1. Validate receiver
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) throw new ErrorWithProps("No user found!", { code: 404 });

    // 2. Find or create conversation
    let conversation = await ConversationModel.findOne({
      participants: { $all: [ctx.user, receiverId] },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [ctx.user, receiverId],
        messages: [],
        lastMessage: null,
        unreadCount: new Map<string, number>(),
      });
    }

    // 3. Create the message doc
    const message = await MessageModel.create({
      sender: ctx.user,
      text,
      status: [{ user: ctx.user, state: MessageStatusEnum.SENT }],
    });

    // 4. Push only the ref (_id) into conversation
    conversation.messages.push(message._id);

    // 5. Update lastMessage & unreadCount
    conversation.lastMessage = message._id;
    const unread = conversation.unreadCount.get(receiverId) ?? 0;
    conversation.unreadCount.set(receiverId, unread + 1);

    // 6. Save conversation
    await conversation.save();

    // 7. Emit message via Socket.IO
    const receiverSocketId = await MessageService.redis.get(
      `socket:${receiverId}`
    );

    if (receiverSocketId) {
      MessageService.io.to(receiverSocketId).emit("chatMessage", {
        conversationId: conversation._id,
        message, // full doc
      });

      // update delivered status
      await MessageModel.findByIdAndUpdate(message._id, {
        $push: {
          status: { user: receiverId, state: MessageStatusEnum.DELIVERED },
        },
      });
    }

    return true;
  }
  async updateMessageStatus(
    conversationId: string,
    messageId: string,
    newState: MessageStatusEnum,
    ctx: Context
  ): Promise<boolean> {
    const readerId = ctx.user; // current user opening the chat

    // 1. Fetch the message
    const messageDoc = await MessageModel.findById(messageId);
    if (!messageDoc) throw new Error("Message not found");

    // 2. Only update status if the reader is the receiver
    // For 1-1, the sender is messageDoc.sender, so reader != sender
    if (readerId !== messageDoc.sender.toString()) {
      messageDoc.status = newState;
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
      const senderSocketId = await MessageService.redis.get(
        `socket:${senderId}`
      );
      if (senderSocketId) {
        MessageService.io.to(senderSocketId).emit("messageStatusUpdate", {
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
