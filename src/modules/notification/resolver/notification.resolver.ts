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
  Mutation,
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
    @Arg("page", () => Int, { defaultValue: 1, nullable: true }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10, nullable: true })
    limit: number,
    @Ctx() ctx: Context
  ): Promise<PaginatedNotifications> {
    return this.notification.getAllNotifications(page, limit, ctx);
  }

  /**
   * Get unread notifications
   */
  @Query(() => Number)
  @UseMiddleware(isAuth)
  async getUnreadNotifications(@Ctx() ctx: Context): Promise<Number> {
    return this.notification.getUnreadNotifications(ctx);
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async markAllRead(@Ctx() ctx: Context): Promise<boolean> {
    return this.notification.markAllRead(ctx);
  }
}
