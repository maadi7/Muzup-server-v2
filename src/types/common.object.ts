// import {
//   index,
//   ModelOptions,
//   mongoose,
//   prop,
//   Severity,
// } from "@typegoose/typegoose";
// import { Field, ID, ObjectType } from "type-graphql";
// // import {
// //   EmailAutomationSendTypeAutomatedEnum,
// //   EmailAutomationSendTypeUserActionEnum,
// //   EmailUserActionTemplateEnum,
// //   FrequencyEmailUserBasedActionEnum,
// // } from "../modules/masters/interface/masters.enum";
// import { MenuTypeEnum } from "../modules/menu/interfaces/menu.enum";
// import { Places } from "../modules/places/interface/index.types";
// import { StatusEnum } from "./common.enum";

// @ObjectType()
// export class StateData {
//   @Field()
//   @prop()
//   stateId: string;

//   @Field()
//   @prop()
//   stateName: string;
// }

// @ObjectType()
// export class TimezoneData {
//   @Field()
//   @prop()
//   timezoneId: string;

//   @Field()
//   @prop()
//   timezoneName: string;
// }

// @ObjectType()
// export class CuisineData {
//   @Field()
//   @prop()
//   cuisineId: string;

//   @Field()
//   @prop()
//   cuisineName: string;
// }

// // x & y coordinates
// @ObjectType()
// @index({ LocationCommon: "2dsphere" })
// export class LocationCommon {
//   @Field(() => String, { nullable: true })
//   @prop({ type: String, default: "Point" })
//   type: string;

//   @Field(() => [Number])
//   @prop({ type: Number })
//   coordinates: mongoose.Types.Array<number>;
// }

// @ObjectType()
// export class AddressInfo {
//   @Field(() => ID)
//   @prop({ auto: true })
//   _id: mongoose.Types.ObjectId;

//   @Field(() => String, { nullable: false })
//   @prop()
//   addressLine1: string;

//   @Field(() => String, { nullable: true })
//   @prop()
//   addressLine2: string;

//   @Field(() => StateData, { nullable: false })
//   @prop({ type: StateData })
//   state: StateData;

//   @Field(() => String, { nullable: false })
//   @prop()
//   city: string;

//   @Field(() => Number, { nullable: false })
//   @prop()
//   zipcode: number;

//   @Field(() => LocationCommon, { nullable: true })
//   @prop({ type: LocationCommon })
//   coordinate: LocationCommon;

//   @Field(() => Places, { nullable: true })
//   @prop({ type: Places, _id: false })
//   place: Places;
// }

// @ObjectType()
// export class TaxRateInfo {
//   @Field(() => ID, { nullable: false })
//   @prop({ required: true, type: mongoose.Types.ObjectId })
//   _id: string;

//   @Field(() => String, { nullable: false })
//   @prop({ required: true })
//   name: string;

//   @Field(() => Number, { nullable: false })
//   @prop({ required: true })
//   salesTax: number;
// }

// @ObjectType()
// export class Hours {
//   @Field(() => String)
//   @prop()
//   start: string;

//   @Field(() => String)
//   @prop()
//   end: string;
// }

// @ObjectType()
// export class Availability {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => String, { nullable: false })
//   @prop()
//   day: string;

//   @Field(() => [Hours], { nullable: false })
//   @prop({ type: Hours })
//   hours: Hours[];

//   @Field(() => Boolean)
//   @prop({ type: Boolean })
//   active: boolean;
// }

// @ObjectType()
// @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class Visibility {
//   @Field(() => MenuTypeEnum, { nullable: false })
//   @prop({ default: MenuTypeEnum.OnlineOrdering })
//   menuType: MenuTypeEnum;

//   @Field(() => StatusEnum, { nullable: false })
//   @prop({})
//   status: StatusEnum;
// }

// @ObjectType()
// export class DeviceInfo {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => String)
//   @prop({ required: true })
//   type: string;

//   @Field(() => String)
//   @prop({ required: true })
//   uniqueId: string;

//   @Field(() => String)
//   @prop({ required: true })
//   deviceName: string;

//   @Field(() => String)
//   @prop({ required: true })
//   deviceOS: string;
// }

// @ObjectType()
// export class AccessHistory {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => DeviceInfo)
//   @prop({ required: true })
//   device: DeviceInfo;

//   @Field(() => Date)
//   @prop()
//   createdAt: Date;
// }

// @ObjectType()
// export class UTMDetails {
//   @Field(() => String, { nullable: true })
//   @prop({ required: false, default: null })
//   source: string | null;

//   @Field(() => String, { nullable: true })
//   @prop({ required: false, default: null })
//   medium: string | null;

//   @Field(() => String, { nullable: true })
//   @prop({ required: false, default: null })
//   campaign: string | null;
// }

// @ObjectType()
// export class CampaignDetails {
//   @Field(() => String, { nullable: true })
//   @prop({ required: false, default: null })
//   campaignId: string | null;
// }

// @ObjectType()
// export class AutomatedEmailTemplate {
//   @Field(() => String, { nullable: false })
//   @prop()
//   content: string;

//   @Field(() => String, { nullable: false })
//   @prop()
//   designJson: string;

//   @Field(() => String)
//   @prop({ required: true })
//   html: string;
// }

// @ObjectType()
// @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class SendingTriggerData {
//   @Field(() => EmailAutomationSendTypeAutomatedEnum)
//   @prop({
//     required: true,
//     default: EmailAutomationSendTypeAutomatedEnum.SendOnTriggerDate,
//   })
//   sendType: EmailAutomationSendTypeAutomatedEnum;

//   @Field(() => Number, { nullable: true })
//   @prop({ required: false })
//   sendingDays?: number;
// }

// @ObjectType()
// @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class RestaurantAutomatedEmailCampaign {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => String)
//   @prop({ required: true })
//   name: string;

//   @Field(() => String)
//   @prop({ required: true })
//   subject: string;

//   @Field(() => Date, { nullable: false })
//   @prop({ required: true, default: Date.now })
//   triggerDate: Date;

//   @Field(() => SendingTriggerData)
//   @prop({ required: true })
//   triggeringData: SendingTriggerData;

//   @Field(() => AutomatedEmailTemplate)
//   @prop({ type: () => AutomatedEmailTemplate, required: true })
//   template: AutomatedEmailTemplate;

//   @Field(() => StatusEnum, { defaultValue: false })
//   @prop({ required: true, default: StatusEnum.inactive })
//   status: StatusEnum;
// }

// // userAction based email campaign
// @ObjectType()
// @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class UserActionTriggerData {
//   @Field(() => EmailAutomationSendTypeUserActionEnum)
//   @prop({ required: true })
//   sendType: EmailAutomationSendTypeUserActionEnum;

//   @Field(() => FrequencyEmailUserBasedActionEnum, { nullable: true })
//   @prop({ required: false })
//   frequency: FrequencyEmailUserBasedActionEnum;

//   @Field(() => Number, { nullable: true })
//   @prop({ required: false })
//   delayTimer: number;
// }

// @ObjectType()
// @ModelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class RestaurantUserActionEmailCampaign {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => String)
//   @prop({ required: true })
//   name: string;

//   @Field(() => String)
//   @prop({ required: true })
//   subject: string;

//   @Field(() => EmailUserActionTemplateEnum)
//   @prop({ required: true })
//   triggerLogic: EmailUserActionTemplateEnum;

//   @Field(() => UserActionTriggerData)
//   @prop({ required: true })
//   triggeringData: UserActionTriggerData;

//   @Field(() => AutomatedEmailTemplate)
//   @prop({ type: () => AutomatedEmailTemplate, required: true })
//   template: AutomatedEmailTemplate;

//   @Field(() => StatusEnum, { defaultValue: false })
//   @prop({ required: true, default: StatusEnum.inactive })
//   status: StatusEnum;
// }
