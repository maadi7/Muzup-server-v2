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
import { Notification } from "../schema/notification.schema";
import NotificationService from "../service/notification.service";

@Resolver()
export default class NotificationResolver {
  constructor(private notification: NotificationService) {
    this.notification = new NotificationService();
  }
}
