import { GraphQLError as ApolloError } from "graphql";
import Joi from "joi";
import moment from "moment";
import Context from "../../../interface/context";
import { OtpModel } from "../schema/otp.schema";
import { decode } from "punycode";

interface PayoutOtpDetails {
  number: string;
  email: string;
  mobileOtpId: string;
  emailOtpId: string;
}

class OtpService {
  async verifyOtpForPayout(
    key: string,
    numberOtp: string,
    emailOtp: string,
    email: string,
    number: string
  ) {
    const joiSchema = Joi.object({
      number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .messages({
          "string.empty": "Please provide mobile number.",
          "string.length": "Please enter a valid mobile number",
          "string.pattern": "Please enter a valid mobile number",
        }),
      email: Joi.string().email().messages({
        "string.empty": "Please provide email address.",
        "string.email": "Please enter a valid email address",
      }),
      emailOtp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .messages({
          "string.empty": "Please provide email verification code.",
          "string.length": "Please enter a valid email verification code",
          "string.pattern": "Please enter a valid email verification code",
        }),
      numberOtp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .messages({
          "string.empty": "Please provide mobile verification code.",
          "string.length": "Please enter a valid mobile verification code",
          "string.pattern": "Please enter a valid mobile verification code",
        }),
    });

    // Schema Validation
    const { error } = joiSchema.validate({
      number: number,
      email: email,
      emailOtp: emailOtp,
      numberOtp: numberOtp,
    });

    if (error) {
      throw new ApolloError(error.message);
    }

    try {
      const decoded = await decode(key);
      const {
        number: vNum,
        email: vEmail,
        emailOtpId: vEid,
        mobileOtpId: vMid,
      }: PayoutOtpDetails = JSON.parse(decoded);

      // Check Key Valid
      if (vNum !== number) {
        throw new ApolloError("Something went wrong, please try again later.");
      }
      if (vEmail !== email) {
        throw new ApolloError("Something went wrong, please try again later.");
      }

      // Check Otp Valid
      const mobileOtpExists = await OtpModel.findOne({ _id: vMid });
      const emailOtpExists = await OtpModel.findOne({ _id: vEid });

      if (!mobileOtpExists) {
        throw new ApolloError(
          "Invalid mobile verification code, please enter a valid mobile verification code."
        );
      }
      if (!emailOtpExists) {
        throw new ApolloError(
          "Invalid email verification code, please enter a valid email verification code."
        );
      }

      if (mobileOtpExists.otp !== numberOtp) {
        throw new ApolloError(
          "Invalid mobile verification code, please enter a valid mobile verification code."
        );
      }

      if (emailOtpExists.otp !== emailOtp) {
        throw new ApolloError(
          "Invalid email verification code, please enter a valid email verification code."
        );
      }

      if (
        moment().isSameOrAfter(moment(emailOtpExists.expiresAt)) ||
        moment().isSameOrAfter(moment(mobileOtpExists.expiresAt))
      ) {
        throw new ApolloError(
          "It looks like the verification code has expired. Please request a new one to complete the verification process."
        );
      }

      return true;
    } catch (error: any) {
      throw new ApolloError(error.toString());
    }
  }
}

export default OtpService;
