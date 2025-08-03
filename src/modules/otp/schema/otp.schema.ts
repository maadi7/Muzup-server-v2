import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Otp {
  @Field(() => ID)
  _id: string;

  @Field(() => Date)
  @prop({})
  expiresAt: Date;

  @Field(() => String)
  @prop({})
  otp: string;
}

export const OtpModel = getModelForClass(Otp, {
  schemaOptions: { timestamps: true },
});
