import { Field, InputType } from "type-graphql";
import { FilterDataEnum } from "./common.enum";

@InputType()
export class FilterDataInput {
  @Field(() => String)
  key: string;

  @Field(() => FilterDataEnum)
  operation: FilterDataEnum;

  @Field(() => String, { nullable: true })
  value: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  valueArr: string[];
}
