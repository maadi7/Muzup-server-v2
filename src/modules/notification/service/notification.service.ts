// src/modules/notification/service/notification.service.ts
import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { Notification, NotificationModel } from "../schema/notification.schema";
import { PaginatedNotifications } from "../interface/notification.input";
import { Types } from "mongoose";

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
        .populate({ path: "sender", select: "username profilePic" })
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
  async getUnreadNotifications(ctx: Context): Promise<number> {
    try {
      const uniqueNotifications = await NotificationModel.aggregate([
        {
          $match: {
            receiver: new Types.ObjectId(ctx.user),
            isRead: false,
            isArchived: false,
          },
        },
        {
          $group: {
            _id: "$dedupeKey", // Group by dedupeKey to get unique notifications
            count: { $sum: 1 },
          },
        },
        {
          $count: "uniqueCount",
        },
      ]);

      return uniqueNotifications[0]?.uniqueCount || 0;
    } catch (error) {
      throw error;
    }
  }

  async markAllRead(ctx: Context): Promise<boolean> {
    try {
      await NotificationModel.updateMany(
        { receiver: ctx.user },
        { isRead: true }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default NotificationService;
