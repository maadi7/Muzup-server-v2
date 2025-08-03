import OtpService from "../modules/otp/resolver/otp.resolver";
import UserResolver from "../modules/user/resolver/user.resolver";

export const resolvers = [OtpService, UserResolver] as const;
