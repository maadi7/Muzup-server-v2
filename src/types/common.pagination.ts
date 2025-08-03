import { Field, InputType } from "type-graphql";
import { RowsPerPageEnum } from "./common.enum";

export const getPaginationLimit = (
  rowsPerPageEnum: RowsPerPageEnum | null
): number => {
  if (rowsPerPageEnum == null) {
    return RowsPerPageEnum.TEN;
  }

  return rowsPerPageEnum;
};

@InputType()
export class PaginationInput {
  @Field(() => Number, { nullable: true, defaultValue: null })
  pageNumber: number;

  @Field(() => RowsPerPageEnum, { nullable: true, defaultValue: null })
  rowsPerPage: RowsPerPageEnum;
}

// @InputType()
// export class PayoutPaginationInput {
//   @Field(() => RowsPerPageEnum, { nullable: true, defaultValue: null })
//   rowsPerPage: RowsPerPageEnum;

//   @Field(() => String, { nullable: true, defaultValue: null })
//   start_after: string;

//   @Field(() => String, { nullable: true, defaultValue: null })
//   end_before: string;
// }
