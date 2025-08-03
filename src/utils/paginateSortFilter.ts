import { ErrorWithProps } from "mercurius";
import { FilterQuery, SortOrder } from "mongoose";
import { FilterDataEnum } from "../types/common.enum";
import { FilterDataInput } from "../types/common.filter";
import {
  getPaginationLimit,
  PaginationInput,
} from "../types/common.pagination";
import { SortDataInput } from "../types/common.sort";

// export const handlePaginateSortFilter = <T>(
//   pagination?: PaginationInput,
//   filter?: FilterDataInput[],
//   sort?: SortDataInput
// ) => {
//   try {
//     // Handle Filters
//     let filterQuery: FilterQuery<T> = {};

//     filter?.forEach((f) => {
//       const { key, operation, value, valueArr } = f;

//       if (operation === FilterDataEnum.Contains) {
//         Object.assign(filterQuery, { [key]: { $regex: `(?i)${value}` } });
//       } else if (operation === FilterDataEnum.Equals) {
//         if (!value && valueArr) {
//           Object.assign(filterQuery, { [key]: { $eq: valueArr } });
//         } else {
//           Object.assign(filterQuery, { [key]: { $eq: value } });
//         }
//       } else if (operation === FilterDataEnum.NotEquals) {
//         if (!value && valueArr) {
//           Object.assign(filterQuery, { [key]: { $ne: valueArr } });
//         } else {
//           Object.assign(filterQuery, { [key]: { $ne: value } });
//         }
//       }
//       // else if (
//       //   operation === FilterDataEnum.InArray &&
//       //   Array.isArray(valueArr)
//       // ) {
//       //   Object.assign(filterQuery, { [key]: { $in: valueArr } });
//       // } else if (
//       //   operation === FilterDataEnum.NotInArray &&
//       //   Array.isArray(valueArr)
//       // ) {
//       //   Object.assign(filterQuery, { [key]: { $nin: valueArr } });
//       // }
//       else if (operation === FilterDataEnum.GreaterThan) {
//         Object.assign(filterQuery, { [key]: { $gt: parseFloat(value) } });
//       } else if (operation === FilterDataEnum.LessThan) {
//         Object.assign(filterQuery, { [key]: { $lt: parseFloat(value) } });
//       } else {
//         throw new ErrorWithProps("Unknown filter operation, please try again!");
//       }
//     });

//     // Handle Sorting
//     let sortQuery: { [key: string]: SortOrder } = {};

//     if (sort?.key && sort?.sortType && sort?.sortType !== "None") {
//       sortQuery[sort.key] = sort.sortType.toString().toLowerCase() as SortOrder;
//     }

//     // Handle Pagination
//     let limit = getPaginationLimit(pagination?.rowsPerPage);
//     let pageNumber: number = pagination?.pageNumber ?? 1;
//     if (pageNumber <= 0) {
//       throw new ErrorWithProps("Page number cannot be 0, please try again!");
//     }

//     let skip = (pageNumber - 1) * limit;

//     return { filterQuery, sortQuery, limit, skip };
//   } catch (error) {
//     throw error;
//   }
// };

export const handlePaginateSortFilter = <T>(
  pagination?: PaginationInput,
  filter?: FilterDataInput[],
  sort?: SortDataInput
) => {
  try {
    // Handle Filters
    let filterQuery: FilterQuery<T> = {};

    filter?.forEach((f) => {
      const { key, operation, value, valueArr } = f;

      if (operation === FilterDataEnum.Contains) {
        const escapedSearch = (value ?? "").replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        Object.assign(filterQuery, {
          [key]: { $regex: escapedSearch, $options: "i" },
        });
      } else if (operation === FilterDataEnum.Equals) {
        if (!value && valueArr) {
          Object.assign(filterQuery, { [key]: { $eq: valueArr } });
        } else {
          Object.assign(filterQuery, { [key]: { $eq: value } });
        }
      } else if (operation === FilterDataEnum.NotEquals) {
        if (!value && valueArr) {
          Object.assign(filterQuery, { [key]: { $ne: valueArr } });
        } else {
          Object.assign(filterQuery, { [key]: { $ne: value } });
        }
      } else if (operation === FilterDataEnum.GreaterThan) {
        Object.assign(filterQuery, { [key]: { $gt: parseFloat(value) } });
      } else if (operation === FilterDataEnum.LessThan) {
        Object.assign(filterQuery, { [key]: { $lt: parseFloat(value) } });
      } else {
        throw new ErrorWithProps("Unknown filter operation, please try again!");
      }
    });

    // Handle Sorting
    let sortQuery: { [key: string]: SortOrder } = {};

    if (sort?.key && sort?.sortType && sort?.sortType !== "None") {
      sortQuery[sort.key] = sort.sortType.toString().toLowerCase() as SortOrder;
    }

    // Handle Pagination
    let limit = getPaginationLimit(pagination?.rowsPerPage);
    let pageNumber: number = pagination?.pageNumber ?? 1;
    if (pageNumber <= 0) {
      throw new ErrorWithProps("Page number cannot be 0, please try again!");
    }

    let skip = (pageNumber - 1) * limit;

    return { filterQuery, sortQuery, limit, skip };
  } catch (error) {
    throw error;
  }
};
