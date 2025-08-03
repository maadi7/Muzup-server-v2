import { isBefore, isEqual, parse } from "date-fns";
import Joi from "joi";
import { Day } from "../modules/restaurant/interfaces/restaurant.enums";
import { AccountPreferenceInput } from "../modules/user/interfaces/user.input";
import {
  AddressInfoInput,
  AvailabilityInput,
  HoursInput,
} from "../types/common.input";

export const nameWithSpecialChars = (value: string) => {
  const regex = /^[a-zA-Z0-9-.'!$\/\\]+$/;
  return regex.test(value);
};

export const isAlphanumeric = (value: string) => {
  const regex = /^[a-zA-Z0-9-]+$/;
  return regex.test(value);
};

export const arraysAreEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if every element in arr1 is equal to the corresponding element in arr2
  return arr1.every((element, index) => element === arr2[index]);
};

export const arraysHaveCommonElement = <T>(arr1: T[], arr2: T[]): boolean => {
  // Create a Set from the first array
  const set1 = new Set(arr1);

  // Check if any element in the second array exists in the Set created from the first array
  return arr2.some((element) => set1.has(element));
};

export const joiSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Name field cannot be empty.",
  }),
  desc: Joi.string().messages({
    "string.empty": "Description field cannot be empty.",
  }),
  content: Joi.string().max(180).messages({
    "string.empty": "Content cannot be empty",
    "string.length": "Content cannot be more than 180 characters",
  }),
  firstName: Joi.string().messages({
    "string.empty": "You have not entered your first name.",
  }),
  lastName: Joi.string().messages({
    "string.empty": "You have not entered your last name.",
  }),
  email: Joi.string().email().messages({
    "string.empty": "You have not entered your email id.",
    "string.email": "You have entered an invalid email id.",
  }),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.empty": "You have not entered your phone number.",
      "string.length": "You have entered an invalid phone number.",
      "string.pattern.base": "You have entered an invalid phone number.",
    }),
  password: Joi.string().messages({
    "string.empty": "You have not entered your password.",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.empty": "Please provide verification code.",
      "string.length": "Please enter a valid verification code",
      "string.pattern.base": "Please enter a valid verification code",
    }),
  salesTax: Joi.number().positive().precision(2).messages({
    "number.base": "Sales tax must be a number.",
    "number.positive": "Sales tax must be a positive number.",
    "number.precision":
      "Sales tax must be a valid number with up to two decimal places.",
  }),
  isSpicy: Joi.boolean().messages({
    "boolean.base": '"isSpicy" should be a boolean value',
    "any.required": '"isSpicy" is a required field',
  }),
  isVegan: Joi.boolean().messages({
    "boolean.base": '"isVegan" should be a boolean value',
    "any.required": '"isVegan" is a required field',
  }),
  isHalal: Joi.boolean().messages({
    "boolean.base": '"isHalal" should be a boolean value',
    "any.required": '"isHalal" is a required field',
  }),
  isGlutenFree: Joi.boolean().messages({
    "boolean.base": '"isGlutenFree" should be a boolean value',
    "any.required": '"isGlutenFree" is a required field',
  }),
  hasNuts: Joi.boolean().messages({
    "boolean.base": '"hasNuts" should be a boolean value',
    "any.required": '"hasNuts" is a required field',
  }),
});

export const validateCommunicationPreference = (
  inputData: AccountPreferenceInput
) => {
  let isValid = true;
  const validKeys = ["sms", "email"];

  const inputKeys = Object.keys(inputData);
  if (
    inputKeys.length !== 2 ||
    !inputKeys.every((key) => validKeys.includes(key))
  ) {
    isValid = false;
  }

  return isValid ? { isValid: true } : { isValid: false };
};

const checkTimeSlotOverlaps = (timeSlots: HoursInput[]): boolean => {
  // Convert time slots to Date objects and handle cross-midnight times
  const slots = timeSlots.map((slot) => {
    const startDate = parse(slot.start, "HH:mm", new Date());
    let endDate = parse(slot.end, "HH:mm", new Date());

    // Handle cross-midnight times by adding one day to the end time
    if (isBefore(endDate, startDate) || isEqual(endDate, startDate)) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return { startDate, endDate };
  });

  // Sort the time slots by start time
  slots.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Check for overlaps between consecutive time slots
  for (let i = 0; i < slots.length - 1; i++) {
    const currentSlot = slots[i];
    const nextSlot = slots[i + 1];

    if (currentSlot.endDate > nextSlot.startDate) {
      // Overlap detected
      return true;
    }
  }

  // No overlaps found
  return false;
};

export const availabilityValidation = (
  input: AvailabilityInput[]
): { success: boolean; error: string } => {
  if (!input || input.length !== 7) {
    return {
      success: false,
      error: "Please provide availability for all the weekdays and try again!",
    };
  }

  const inputDaysSet = new Set(
    input.map((item: AvailabilityInput) => item.day)
  );
  const allDaysPresent = Object.values(Day).every((day) =>
    inputDaysSet.has(day)
  );

  if (!allDaysPresent) {
    return {
      success: false,
      error: "Please provide availability for all the weekdays and try again!",
    };
  }

  for (const availability of input) {
    const { hours, active } = availability;
    if (active) {
      const checkOverlap = checkTimeSlotOverlaps(hours);

      if (checkOverlap) {
        return {
          success: false,
          error: `Overlapping time slots for ${availability.day}, please fix and try again!`,
        };
      }
    }
  }

  return { success: true, error: "" };
};

// export function validateEIN(ein: string) {
//   let einValid = true;

//   const einPattern = /^\d{9}$/;
//   einValid = einPattern.test(ein);

//   const invalidSequences = [
//     "123456789",
//     "987654321",
//     "111111111",
//     "222222222",
//     "333333333",
//     "444444444",
//     "555555555",
//     "666666666",
//     "777777777",
//     "888888888",
//     "999999999",
//     "000000000",
//   ];
//   if (invalidSequences.includes(ein)) {
//     einValid = false;
//   }

//   // EIN must not start with "00", "07", or "89"
//   if (/^(00|07|89)/.test(ein)) {
//     einValid = false;
//   }

//   return {
//     ein: einValid,
//   };
// }

// export function validateISODate(dateString:string) {
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) {
//     return false; // Invalid date
//   }

//   const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/;
//   return isoDatePattern.test(dateString);
// }

export function validateISODate(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false; // Invalid date
  }

  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}([+-]\d{2}:\d{2}|Z)$/;
  return isoDatePattern.test(dateString);
}

export function validateUSAddress(address: AddressInfoInput) {
  // Check that addressLine1, city, state, and place are non-empty strings
  if (
    typeof address.addressLine1 !== "string" ||
    address.addressLine1.trim() === "" ||
    typeof address.city !== "string" ||
    address.city.trim() === "" ||
    typeof address.state.stateName !== "string" ||
    address.state.stateName.trim() === "" ||
    typeof address.place.displayName !== "string" ||
    address.place.displayName.trim() === ""
  ) {
    return false;
  }

  // Check that zipcode is a number and within a reasonable range
  if (
    typeof address.zipcode !== "number" ||
    !Number.isInteger(address.zipcode) ||
    address.zipcode <= 0
  ) {
    return false;
  }

  // If addressLine2 is provided, ensure it is a string (can be empty)
  if (
    address.addressLine2 !== null &&
    typeof address.addressLine2 !== "string"
  ) {
    return false;
  }

  // Check coordinates
  if (
    !Array.isArray(address.coordinate.coordinates) ||
    address.coordinate.coordinates.length !== 2
  ) {
    return false;
  }

  return true;
}

export function validateOnboardingUSAddress(address: AddressInfoInput) {
  // Check that addressLine1, city, state, and place are non-empty strings
  if (
    typeof address.addressLine1 !== "string" ||
    address.addressLine1.trim() === "" ||
    typeof address.city !== "string" ||
    address.city.trim() === "" ||
    typeof address.state.stateName !== "string" ||
    address.state.stateName.trim() === ""
  ) {
    return false;
  }

  // Check that zipcode is a number and within a reasonable range
  if (
    typeof address.zipcode !== "number" ||
    !Number.isInteger(address.zipcode) ||
    address.zipcode <= 0
  ) {
    return false;
  }

  // If addressLine2 is provided, ensure it is a string (can be empty)
  if (
    address.addressLine2 !== null &&
    typeof address.addressLine2 !== "string"
  ) {
    return false;
  }

  return true;
}

export function enumValidation(enumType: any, inputEnumType: string) {
  const isValidStatus = Object.values(enumType).includes(inputEnumType);
  return isValidStatus;
}

export function enumArrayValidation<T extends object>(
  enumType: T,
  inputEnumType: (keyof T)[]
): { success: boolean; error: string } {
  const uniqueCategories = new Set<keyof T>();
  const enumKeys = new Set(Object.keys(enumType) as Array<keyof T>);

  for (const field of inputEnumType) {
    if (!enumKeys.has(field)) {
      return {
        success: false,
        error: `Invalid field value: ${field.toString()}.`,
      };
    }
    if (uniqueCategories.has(field)) {
      return {
        success: false,
        error: `Duplicate field value found: ${field.toString()}.`,
      };
    }
    uniqueCategories.add(field);
  }

  return { success: true, error: "" };
}

export function validateWebSiteURL(url: string): boolean {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})" + // domain name with TLD
      "(\\:\\d+)?" + // port
      "(\\/[-a-zA-Z\\d%_.~+]*)*" + // path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$" // fragment locator
  );

  return urlPattern.test(url);
}

/**
 * Checks if the array contains duplicate elements based on multiple keys.
 * If any key contains a nested array, it will recursively check for duplicates within the nested array as well.
 *
 * @param array {T[]} - The array of objects to check for duplicates.
 * @param keys {Array<keyof T>} - The list of keys to consider for duplicate checking.
 * @returns {boolean} - Returns true if there are duplicates, otherwise false.
 */
export const hasDuplicatesBasedOnKeys = <T>(
  array: T[],
  keys: Array<keyof T>
): boolean => {
  // Create a Set to store unique combinations of key values
  const seen = new Set<string>();

  const checkForDuplicates = (item: T): boolean => {
    // Build a string combination of key values (including nested arrays)
    const keyCombination = keys
      .map((key) => {
        const value = item[key];

        // If the value is an array, recursively check for duplicates in the array
        if (Array.isArray(value)) {
          return hasDuplicatesBasedOnKeys(value, keys)
            ? "nested-duplicate"
            : "nested-no-duplicate";
        }

        return value;
      })
      .join("|");

    // If this combination is already in the Set, it's a duplicate
    if (seen.has(keyCombination)) {
      return true; // Duplicate found
    }

    // Add the key combination to the Set
    seen.add(keyCombination);
    return false;
  };

  // Loop through the array and check for duplicates
  for (const item of array) {
    if (checkForDuplicates(item)) {
      return true; // Duplicate found
    }
  }

  // No duplicates found
  return false;
};

export const createPromoCodeSchema = Joi.object({
  code: Joi.string().required().messages({
    "string.empty": "Promo code is required.",
    "any.required": "Promo code is required.",
  }),
  startDate: Joi.date().required().messages({
    "date.base": "Invalid start date.",
    "any.required": "Start date is required.",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.base": "Invalid end date.",
    "date.greater": "End date must be after start date.",
    "any.required": "End date is required.",
  }),
  maxUsage: Joi.number().positive().integer().required().messages({
    "number.base": "Max usage must be a number.",
    "number.positive": "Max usage must be a positive number.",
    "any.required": "Max usage is required.",
  }),
  promoCodeDiscountType: Joi.string()
    .valid("PERCENTAGE", "FIXED")
    .required()
    .messages({
      "any.only": "Invalid discount type. Must be 'PERCENTAGE' or 'FIXED'.",
      "any.required": "Promo code discount type is required.",
    }),
  discountValue: Joi.number().positive().optional().messages({
    "number.base": "Discount value must be a positive number.",
  }),
  discountItemId: Joi.string().optional().messages({
    "string.base": "Discount item ID must be a valid string.",
  }),
});
