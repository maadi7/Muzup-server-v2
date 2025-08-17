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
import MessageService from "../service/message.service";
import { MessageStatusEnum } from "../schema/message.schema";

@Resolver()
export default class MessageResolver {
  constructor(private message: MessageService) {
    this.message = new MessageService();
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async sendMessage(
    @Arg("recieverId") recieverId: string,
    @Arg("text") text: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return await this.message.sendMessage(recieverId, text, ctx);
  }

  //TODO:Add Validations in this resolver
  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async updateMessageStatus(
    @Arg("conversationId") conversationId: string,
    @Arg("messageId") messageId: string,
    @Arg("newState") newState: MessageStatusEnum
  ): Promise<boolean> {
    return await this.message.updateMessageStatus(
      conversationId,
      messageId,
      newState
    );
  }
}
