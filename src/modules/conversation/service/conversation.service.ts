import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";

import { User, UserModel } from "../../user/schema/user.schema";
import { Conversation, ConversationModel } from "../schema/conversation.schema";
import { SidebarChat } from "../interface/conversation.interface";
import { Message } from "../../message/schema/message.schema";

class ConversationService {
  async createChat(id: string, ctx: Context): Promise<string> {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        throw new ErrorWithProps("User not found!", { code: 404 });
      }
      const participants = [id, ctx.user];
      const existingChat = await ConversationModel.findOne({
        participants: { $all: participants, $size: participants.length },
      });
      if (existingChat) {
        return existingChat._id.toString();
      }

      const newChat = await ConversationModel.create({
        participants: participants,
      });

      return newChat._id.toString(); // Return the chat ID as string
    } catch (error) {
      throw new ErrorWithProps("Failed to create chat", { error });
    }
  }

  async getAllChats(ctx: Context): Promise<Conversation[]> {
    try {
      if (!ctx.user) throw new Error("User not authenticated");

      const chats = await ConversationModel.find({
        participants: ctx.user, // MongoDB automatically checks if ctx.user is in the array
      })
        .populate("participants")
        .populate("messages");

      return chats;
    } catch (error) {
      throw error;
    }
  }

  async getChat(id: string, ctx: Context): Promise<Conversation> {
    try {
      const chats = await ConversationModel.findOne({
        _id: id,
        participants: ctx.user,
      }).populate("participants");

      return chats;
    } catch (error) {
      throw error;
    }
  }

  async getSidebarChats(ctx: Context): Promise<SidebarChat[]> {
    try {
      const conversations = await ConversationModel.find({
        participants: ctx.user,
      })
        .populate("participants", "username profilePic")
        .sort({ updatedAt: -1 });

      const sidebarChats: SidebarChat[] = conversations.map((conv) => {
        const otherUser = conv.participants.find(
          (p) => (p as any)._id.toString() !== ctx.user
        ) as User;

        const userUnreadCount =
          conv.unreadCount?.get(ctx.user.toString()) ?? null;

        const lastMsg = conv.lastMessage as Message;

        return {
          conversationId: conv._id.toString(),
          userId: otherUser._id.toString(),
          username: otherUser.username,
          profilePic: otherUser.profilePic,
          lastMessage: lastMsg?.text || "",
          lastMessageTime: lastMsg?.createdAt || conv.updatedAt,
          unreadCount: userUnreadCount ?? null,
        };
      });

      return sidebarChats;
    } catch (error) {
      throw error;
    }
  }
}

export default ConversationService;
