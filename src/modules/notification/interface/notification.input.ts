import { Field, ObjectType } from "type-graphql";
import { Notification } from "../schema/notification.schema";

@ObjectType()
export class PaginatedNotifications {
  @Field(() => [Notification])
  notifications: Notification[];

  @Field(() => Boolean)
  hasMore: boolean;
}
