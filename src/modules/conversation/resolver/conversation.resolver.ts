import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../../../middleware/auth";
import Context from "../../../interface/context";
import ConversationService from "../service/conversation.service";
import { Conversation, ConversationModel } from "../schema/conversation.schema";
import { SidebarChat } from "../interface/conversation.interface";

@Resolver()
export default class ConversationResolver {
  constructor(private chat: ConversationService) {
    this.chat = new ConversationService();
  }

  @Mutation(() => String)
  @UseMiddleware([isAuth])
  async createChat(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<string> {
    return await this.chat.createChat(id, ctx);
  }

  @Query(() => [Conversation])
  @UseMiddleware([isAuth])
  async getAllChat(@Ctx() ctx: Context): Promise<Conversation[]> {
    return await this.chat.getAllChats(ctx);
  }

  @Query(() => Conversation)
  @UseMiddleware([isAuth])
  async getChat(
    @Arg("id") id: string,
    @Ctx() ctx: Context
  ): Promise<Conversation> {
    return await this.chat.getChat(id, ctx);
  }

  @Query(() => [SidebarChat])
  @UseMiddleware([isAuth])
  async getSidebarChats(@Ctx() ctx: Context): Promise<SidebarChat[]> {
    return await this.chat.getSidebarChats(ctx);
  }
}
