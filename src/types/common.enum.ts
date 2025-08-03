import { registerEnumType } from "type-graphql";

export enum RowsPerPageEnum {
  TEN = 10,
  THIRTY = 30,
  FIFTY = 50,
}

export enum FilterDataEnum {
  Contains = "Contains",
  Equals = "Equals",
  NotEquals = "NotEquals",
  // InArray = "InArray",
  // NotInArray = "NotInArray",
  GreaterThan = "GreaterThan",
  LessThan = "LessThan",
}

export enum SortDataEnum {
  Asc = "Asc",
  Desc = "Desc",
  None = "None",
}

registerEnumType(RowsPerPageEnum, {
  name: "RowsPerPageEnum",
  description: "Enum to store the count of items per page",
});

registerEnumType(FilterDataEnum, {
  name: "FilterDataEnum",
  description: "Enum to store the types of operation for data filtering",
});

registerEnumType(SortDataEnum, {
  name: "SortDataEnum",
  description: "Enum to store the types of sorting options data filtering",
});
