// src/modules/notification/service/notification.service.ts
import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { Notification, NotificationModel } from "../schema/notification.schema";
import { PaginatedNotifications } from "../interface/notification.input";

class NotificationService {
  /**
   * Get all notifications (paginated)
   */
  async getAllNotifications(
    page: number,
    limit: number,
    ctx: Context
  ): Promise<PaginatedNotifications> {
    try {
      const skip = (page - 1) * limit;

      const notifications = await NotificationModel.find({
        receiver: ctx.user,
        isArchived: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await NotificationModel.countDocuments({
        receiver: ctx.user,
        isArchived: false,
      });

      return {
        notifications,
        hasMore: skip + notifications.length < totalCount,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(ctx: Context): Promise<Notification[]> {
    try {
      return await NotificationModel.find({
        receiver: ctx.user,
        isRead: false,
        isArchived: false,
      })
        .sort({ createdAt: -1 })
        .lean();
    } catch (error) {
      throw error;
    }
  }
}

export default NotificationService;
