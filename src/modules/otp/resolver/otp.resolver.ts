import { Arg, Ctx, Query, UseMiddleware } from "type-graphql";
import OtpService from "../service/otp.service";

export default class OtpResolver {
  constructor(private service: OtpService) {
    this.service = new OtpService();
  }

  @Query(() => String)
  verifyOtpForPayout(
    @Arg("key") key: string,
    @Arg("numberOtp") numberOtp: string,
    @Arg("emailOtp") emailOtp: string,
    @Arg("email") email: string,
    @Arg("number") number: string
  ) {
    return this.service.verifyOtpForPayout(
      key,
      numberOtp,
      emailOtp,
      email,
      number
    );
  }
}
