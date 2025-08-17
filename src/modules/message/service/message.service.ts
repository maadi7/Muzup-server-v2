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
    if (!receiver) {
      throw new ErrorWithProps("No user found!", { code: 404 });
    }

    // 2. Find or create conversation
    let conversation = await ConversationModel.findOne({
      participants: { $all: [ctx.user, receiverId] },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [ctx.user, receiverId],
        messages: [],
      });
    }

    // 3. Create the message doc in Message collection
    const message = await MessageModel.create({
      sender: ctx.user,
      text,
      status: [{ user: ctx.user, state: MessageStatusEnum.SENT }],
    });

    // 4. Push only the ref (_id) into conversation
    conversation.messages.push(message._id);
    await conversation.save();

    // 5. Emit message via Socket.IO
    const receiverSocketId = await MessageService.redis.get(
      `socket:${receiverId}`
    );

    if (receiverSocketId) {
      MessageService.io.to(receiverSocketId).emit("chatMessage", {
        conversationId: conversation._id,
        message, // full doc here so client doesn’t need to fetch
      });

      // Here we can update message status to delivered
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
    newState: MessageStatusEnum
  ): Promise<boolean> {
    const message = await MessageModel.findById(messageId);
    if (!message) throw new Error("Message not found");

    message.status = newState;
    await message.save();

    const conversation = await ConversationModel.findById(
      conversationId
    ).populate("participants");
    if (!conversation) throw new Error("Conversation not found");

    for (const participant of conversation.participants) {
      if (participant.toString() !== message.sender.toString()) {
        const socketId = await MessageService.redis.get(
          `socket:${participant}`
        );
        if (socketId) {
          MessageService.io.to(socketId).emit("messageStatusUpdate", {
            conversationId,
            messageId,
            newState,
          });
        }
      }
    }
    return true;
  }
}

export default MessageService;
