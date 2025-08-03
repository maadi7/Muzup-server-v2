import { Field, InputType } from "type-graphql";
import { SortDataEnum } from "./common.enum";

@InputType()
export class SortDataInput {
  @Field(() => String)
  key: string;

  @Field(() => SortDataEnum)
  sortType: SortDataEnum;
}
