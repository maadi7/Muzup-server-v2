// src/modules/notification/resolver/notification.resolver.ts
import {
  Arg,
  Ctx,
  Query,
  Resolver,
  UseMiddleware,
  ObjectType,
  Field,
  Int,
} from "type-graphql";
import { isAuth } from "../../../middleware/auth";
import Context from "../../../interface/context";
import { Notification } from "../schema/notification.schema";
import NotificationService from "../service/notification.service";
import { PaginatedNotifications } from "../interface/notification.input";

@Resolver()
export default class NotificationResolver {
  private notification: NotificationService;

  constructor() {
    this.notification = new NotificationService();
  }

  /**
   * Get all notifications (paginated)
   */
  @Query(() => PaginatedNotifications)
  @UseMiddleware(isAuth)
  async getAllNotifications(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
    @Ctx() ctx: Context
  ): Promise<PaginatedNotifications> {
    return this.notification.getAllNotifications(page, limit, ctx);
  }

  /**
   * Get unread notifications
   */
  @Query(() => [Notification])
  @UseMiddleware(isAuth)
  async getUnreadNotifications(@Ctx() ctx: Context): Promise<Notification[]> {
    return this.notification.getUnreadNotifications(ctx);
  }
}
