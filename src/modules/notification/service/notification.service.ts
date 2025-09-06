import { ErrorWithProps } from "mercurius";
import Context from "../../../interface/context";
import { SocketServer } from "../../../utils/socket";
import { RedisClient } from "../../../utils/redis";

class NotificationService {
  public static io = SocketServer.getIO();
  public static redis = RedisClient.getInstance();
}

export default NotificationService;
