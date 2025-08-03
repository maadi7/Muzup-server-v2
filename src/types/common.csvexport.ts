import { Field, InputType } from "type-graphql";

@InputType()
export class CsvExportInput {
  @Field(() => String, { nullable: false })
  fileName: string;

  @Field(() => [String], { nullable: true })
  selectedRows?: string[];
}
