// import {
//   ActivityActionType,
//   ResCustomCondition,
//   ResCustomConditionGroup,
//   ResCustomFieldTypeEnum,
//   TransactionType,
// } from "@choose-pos/choose-shared";
// import { DateTime } from "luxon";
// import { ErrorWithProps } from "mercurius";
// import { CartItem } from "../modules/cart/schema/cart.schema";
// import { GiftCardModel } from "../modules/giftCard/schema/giftCard.schema";
// import {
//   CustomCampaignFilter,
//   CustomEmailTargetType,
//   RestaurantEmailCampaignStatusEnum,
// } from "../modules/marketing/interface/restaurantCampaign.enum";
// import { PermissionTypeEnum } from "../modules/masters/interface/masters.enum";
// import { PriceTypeEnum } from "../modules/modifiers/interfaces/modifier.enum";
// import { ModifierGroupModel } from "../modules/modifiers/schema/modifier.schema";
// import { OrderModel } from "../modules/order/schema/order.schema";
// import { PromoCodeModel } from "../modules/promoCode/schema/promoCode.schema";
// import { LocationCommonInput } from "../types/common.input";
// import { Availability, LocationCommon } from "../types/common.object";
// import { arraysHaveCommonElement } from "./validations";
// import {
//   ResCustomConditionGroupInput,
//   ResCustomConditionInput,
// } from "../modules/marketing/interface/restaurantEmail.input";
// import { ResEmailCampaignModel } from "../modules/marketing/schemas/restaurantEmailCampaign.schema";
// import { RestaurantModel } from "../modules/restaurant/schema/restaurant.schema";
// import { CustomerModel } from "../modules/customer/schema/customer.schema";
// import { LoyaltyPointsTransactionModel } from "../modules/loyalty/schema/loyaltyTransaction.schema";

// Production check
export const isProduction = process.env.NODE_ENV === "production";

// // Function to check if permissionType is in the permissions array and is active
// export const userHasPermission = (
//   permissions: { type: PermissionTypeEnum; status: boolean }[],
//   permissionType: PermissionTypeEnum | PermissionTypeEnum[]
// ): boolean => {
//   // Ensure permissionType is treated as an array
//   const permissionTypes = Array.isArray(permissionType)
//     ? permissionType
//     : [permissionType];

//   return permissions.some(
//     (permission) =>
//       permissionTypes.includes(permission.type) && permission.status
//   );
// };

// // Function to parse the user agent to get device details
// export const parseUserAgent = (userAgent: string) => {
//   // Define regex patterns to match device types and operating systems
//   const deviceTypePatterns = {
//     mobile: /Mobi|Android/i,
//     tablet: /Tablet|iPad/i,
//     desktop: /Win|Mac|Linux|X11/i,
//   };

//   const osPatterns = {
//     Windows: /Windows NT (\d+\.\d+)/,
//     macOS: /Mac OS X (\d+[\._]\d+)/,
//     iOS: /iPhone OS (\d+[\._]\d+)/,
//     Android: /Android (\d+\.\d+)/,
//     Linux: /Linux/,
//   };

//   const browserPatterns = {
//     Edge: /Edg\/(\d+\.\d+)/,
//     Chrome: /Chrome\/(\d+\.\d+)/,
//     Firefox: /Firefox\/(\d+\.\d+)/,
//     Safari: /Version\/(\d+\.\d+).*Safari/,
//     IE: /MSIE (\d+\.\d+);|Trident.*rv:(\d+\.\d+)/,
//   };

//   let deviceType = "unknown";
//   for (const [type, pattern] of Object.entries(deviceTypePatterns)) {
//     if (pattern.test(userAgent)) {
//       deviceType = type;
//       break;
//     }
//   }

//   let deviceOS = "unknown";
//   for (const [os, pattern] of Object.entries(osPatterns)) {
//     const match = userAgent.match(pattern);
//     if (match) {
//       deviceOS = match[1] ? `${os} ${match[1].replace("_", ".")}` : os;
//       break;
//     }
//   }

//   let browserName = "unknown";
//   for (const [browser, pattern] of Object.entries(browserPatterns)) {
//     const match = userAgent.match(pattern);
//     if (match) {
//       browserName = match[1] ? `${browser} ${match[1]}` : browser;
//       break;
//     }
//   }
//   return { deviceType, deviceOS, browserName };
// };

// // // Function to mask EIN number
// // export const maskEIN = (ein: string) => {
// //   return ein.replace(/\d{4}$/, "**");
// // };

// Function to mask user email
export const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return local.replace(/.(?=.{3})/g, "*") + "@" + domain;
};

// // Function to mask user number
// export const maskPhone = (phone: string) => {
//   return phone.replace(/\d(?=\d{4})/g, "*");
// };

// // Common function to check availabliibility
// export function isAvailable(availability: Availability[]): boolean {
//   const today = new Date();
//   const currentDay = today
//     .toLocaleString("en-US", { weekday: "long" })
//     .toLowerCase(); // Gets current day, e.g., 'monday'
//   const currentTime = today.getTime(); // Current time in milliseconds

//   // Find today's availability
//   const todayAvailability = availability.find(
//     (avail) => avail.day.toLowerCase() === currentDay && avail.active
//   );

//   if (!todayAvailability) {
//     return false;
//   }

//   // Check if current time falls within any of the available hours
//   const isWithinHours = todayAvailability.hours.some((hour) => {
//     const startTime = new Date(hour.start).getTime();
//     const endTime = new Date(hour.end).getTime();
//     return currentTime >= startTime && currentTime <= endTime;
//   });

//   return isWithinHours;
// }

// export function generateRandomOrderId(): string {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < 8; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }
// //Generate Random OrderId but only to be used for the ordering Module
// export async function generateUniqueOrderId(): Promise<string> {
//   let isUnique = false;
//   let orderId = "";

//   while (!isUnique) {
//     orderId = generateRandomOrderId();
//     const existingOrder = await OrderModel.findOne({ orderId });
//     if (!existingOrder) {
//       isUnique = true;
//     }
//   }

//   return orderId;
// }

// type CodeType = "promoCode" | "giftCard";

// export async function generateUniqueCode(
//   prefix: string,
//   length: number,
//   type: CodeType
// ): Promise<string> {
//   const maxAttempts = 10; // Maximum number of attempts to generate a unique code
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//     const code = generateCode(prefix, length);
//     const isUnique = await isCodeUnique(code, type);

//     if (isUnique) {
//       return code;
//     }

//     attempts++;
//   }

//   throw new Error("Unable to generate a unique code after maximum attempts");
// }

// function generateCode(prefix: string, length: number): string {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let result = prefix;

//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }

//   return result;
// }

// async function isCodeUnique(code: string, type: CodeType): Promise<boolean> {
//   if (type === "promoCode") {
//     const existingPromoCode = await PromoCodeModel.findOne({ code });
//     return !existingPromoCode;
//   } else if (type === "giftCard") {
//     const existingGiftCard = await GiftCardModel.findOne({ code });
//     return !existingGiftCard;
//   }

//   throw new Error("Invalid code type");
// }

// export function calculateDistanceInMiles(
//   coord1: LocationCommon,
//   coord2: LocationCommonInput
// ): number {
//   const R = 3963.19;

//   const lat1 = coord1.coordinates[0];
//   const lon1 = coord1.coordinates[1];
//   const lat2 = coord2.coordinates[0];
//   const lon2 = coord2.coordinates[1];

//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// export interface TimeComponents {
//   hours: number;
//   minutes: number;
// }

// // Time-related utilities
// export function getTimeComponents(
//   time: Date | string | null | undefined
// ): TimeComponents | null {
//   if (!time) return null;

//   const date = typeof time === "string" ? new Date(time) : time;
//   return {
//     hours: date.getHours(),
//     minutes: date.getMinutes(),
//   };
// }

// export function convertTimeToMinutes(
//   time: Date | string | null | undefined
// ): number | null {
//   const components = getTimeComponents(time);
//   if (!components) return null;
//   return components.hours * 60 + components.minutes;
// }

// export function validateTimeRange(
//   startTime?: Date | null,
//   endTime?: Date | null
// ): void {
//   if (!startTime || !endTime) {
//     return;
//   }

//   const startMinutes = convertTimeToMinutes(startTime);
//   const endMinutes = convertTimeToMinutes(endTime);

//   if (startMinutes !== null && endMinutes !== null) {
//     const isFullDayRange = endMinutes > startMinutes;

//     if (!isFullDayRange) {
//       throw new Error("Start time must be before end time.");
//     }
//   }
// }

// export async function validateCartItems(items: CartItem[]) {
//   // Validate item IDs, quantities, and modifier groups
//   // similar to the validation done in the createOrder function
//   for (const item of items) {
//     // Validate item ID
//     if (!item.itemId) {
//       throw new ErrorWithProps("Item ID is required.");
//     }

//     // Validate quantity
//     if (item.qty <= 0) {
//       throw new ErrorWithProps(
//         `Quantity must be greater than zero for item: ${item.itemId}`
//       );
//     }

//     // Validate modifier groups
//     for (const mg of item.modifierGroups) {
//       // Validate modifier group ID
//       if (!mg.mgId) {
//         throw new ErrorWithProps("Modifier group ID is required.");
//       }

//       // Validate selected modifiers
//       const totalQty = mg.selectedModifiers.length;
//       const mgData = await ModifierGroupModel.findById(mg.mgId);
//       if (!mgData) {
//         throw new ErrorWithProps(`Modifier group not found: ${mg.mgId}`);
//       }

//       if (
//         totalQty > mgData.maxSelections ||
//         (totalQty < mgData.minSelections && !mgData.optional)
//       ) {
//         throw new ErrorWithProps(
//           `Modifier group '${mgData.name}' selection limit exceeded, please try again!`
//         );
//       }

//       if (!mgData.multiSelect && totalQty > 1) {
//         throw new ErrorWithProps(
//           `Modifier group '${mgData.name}' does not allow multiple selections, please select only one modifier.`
//         );
//       }

//       // Validate selected modifier IDs
//       const selectedModifierIds = mg.selectedModifiers.map(
//         (mod) => mod.mid.toString() // Convert each `mid` to a string if it’s a `Ref` type
//       );
//       if (
//         selectedModifierIds.length > 0 &&
//         !arraysHaveCommonElement<string>(
//           selectedModifierIds,
//           mgData.modifiers.map((e) => e.id)
//         )
//       ) {
//         throw new ErrorWithProps(
//           `Modifier group '${mgData.name}' selections are not valid, please try again!`
//         );
//       }
//     }
//   }
// }

// export function calculateOrderTotal(order: any): number {
//   let subTotalAmount = 0;
//   order.items.forEach((item: any) => {
//     let modifiersTotal = 0;
//     item.modifierGroups.forEach((mg: any) => {
//       let mgTotal = 0;
//       switch (mg.pricingType) {
//         case PriceTypeEnum.SamePrice:
//           mgTotal = mg.selectedModifiers.reduce(
//             (total: any, mod: any) => total + mg.price * mod.qty,
//             0
//           );
//           break;
//         case PriceTypeEnum.IndividualPrice:
//           mgTotal = mg.selectedModifiers.reduce(
//             (total: number, mod: any) => total + mod.modifierPrice * mod.qty,
//             0
//           );
//           break;
//         default:
//           mgTotal = 0;
//       }
//       modifiersTotal += mgTotal;
//     });
//     subTotalAmount += (item.itemPrice + modifiersTotal) * item.qty;
//   });

//   const discountAmount = order.appliedDiscount?.discountAmount || 0;
//   const grossAmount = subTotalAmount - discountAmount;

//   return Number(grossAmount.toFixed(2));
// }

// /**
//  * Formats a number to a maximum of 2 decimal places.
//  * If the value is not a valid number, it returns 0.00.
//  * @param value - The number to be formatted
//  * @returns - The formatted number as a float
//  */
// export const formatNumberToMax2 = (value: number): number => {
//   if (isNaN(value)) {
//     return 0;
//   }
//   return parseFloat(value.toFixed(2));
// };

// export const areObjectsEqual = <T extends Record<string, any>>(
//   obj1: T,
//   obj2: T
// ): boolean => {
//   // Check if both objects have the same keys
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   if (keys1.length !== keys2.length) {
//     return false;
//   }

//   // Check if every key in obj1 has the same value in obj2
//   for (const key of keys1) {
//     const val1 = obj1[key];
//     const val2 = obj2[key];

//     // Check if values are objects, recursively compare
//     if (
//       typeof val1 === "object" &&
//       typeof val2 === "object" &&
//       val1 !== null &&
//       val2 !== null
//     ) {
//       if (!areObjectsEqual(val1, val2)) {
//         return false;
//       }
//     } else if (val1 !== val2) {
//       return false;
//     }
//   }

//   return true;
// };

// export const formatWebsiteUrlClickable = (url: string) => {
//   if (!url.match(/^https?:\/\//i)) {
//     return `https://${url}`;
//   }
//   return url;
// };

// // export const isValidUrl = (url: string): boolean => {
// //   try {
// //     new URL(url);
// //     return true;
// //   } catch {
// //     return false;
// //   }
// //   return true
// // };

// export const roundOffPrice = (price: number) => {
//   const decimalPart = price % 1;

//   if (decimalPart === 0) {
//     return price;
//   } else if (decimalPart < 0.5) {
//     return Math.floor(price) + 0.49;
//   } else {
//     return Math.floor(price) + 0.99;
//   }
// };

// export const formatResEmailTarget = (value: string) => {
//   const c = value as CustomEmailTargetType;
//   switch (c) {
//     case CustomEmailTargetType.AllCustomer:
//       return "All Customers";
//     case CustomEmailTargetType.CSV:
//       return "CSV";
//     case CustomEmailTargetType.CustomCustomer:
//       return "Custom Filter";

//     default:
//       return "";
//   }
// };

// export const formatResEmailFilters = (value: string) => {
//   const c = value as CustomCampaignFilter;
//   switch (c) {
//     case CustomCampaignFilter.Active:
//       return "Active Customers";
//     case CustomCampaignFilter.Dormant:
//       return "Dormant Customers";
//     case CustomCampaignFilter.Guests:
//       return "Guests Customers";
//     case CustomCampaignFilter.NewCustomers:
//       return "New Customers";
//     case CustomCampaignFilter.Repeat:
//       return "Repeat Customers";
//     case CustomCampaignFilter.TopSpenders:
//       return "Top Spending Customers";

//     default:
//       return "";
//   }
// };
// export const formatResEmailStatus = (value: string) => {
//   const c = value as RestaurantEmailCampaignStatusEnum;
//   switch (c) {
//     case RestaurantEmailCampaignStatusEnum.cancelled:
//       return "Cancelled";
//     case RestaurantEmailCampaignStatusEnum.completed:
//       return "Completed";
//     case RestaurantEmailCampaignStatusEnum.failed:
//       return "Failed";
//     case RestaurantEmailCampaignStatusEnum.processing:
//       return "Processing";
//     case RestaurantEmailCampaignStatusEnum.scheduled:
//       return "Scheduled";

//     default:
//       return "";
//   }
// };

// export const formatActivityLogType = (type: ActivityActionType): string => {
//   switch (type) {
//     // case ActivityActionType.ADD_ITEM:
//     //   return "Add Item";
//     case ActivityActionType.REFUND_ORDER_LOYALTY_POINTS:
//       return "Refund loyalty points";

//     default:
//       return "";
//   }
// };

// export const isValidSquareName = (str: string): boolean => {
//   if (str == null || typeof str !== "string") {
//     return false;
//   }

//   // Regular expression to match allowed characters
//   // Includes letters, numbers, spaces, and specific special characters
//   const allowedCharactersRegex =
//     /^[a-zA-Z0-9 !@#$%^&*()_+}{[\]?":;'<>,.~`|\\\/-]+$/;

//   // Check for emojis and other unsupported Unicode characters
//   const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;

//   // Check for uncommon special characters by validating against printable ASCII (32 to 126)
//   const uncommonCharRegex = /[^\x20-\x7E]/;

//   // Allow commonly used special characters like hyphens and slashes
//   const commonSpecialCharRegex =
//     /^[a-zA-Z0-9 !@#$%^&*()_+}{[\]?":;'<>,.~`|\\\/\-\s]+$/;

//   // Perform checks
//   return (
//     commonSpecialCharRegex.test(str) &&
//     !emojiRegex.test(str) &&
//     !uncommonCharRegex.test(str)
//   );
// };

// export const toSentenceCase = (str: string): string => {
//   // Split out any parenthesized parts so we can leave them untouched
//   return str
//     .split(/(\([^)]*\))/)
//     .map((part) => {
//       // If this segment is "(…)", return as‑is
//       if (part.startsWith("(") && part.endsWith(")")) {
//         return part;
//       }

//       // Otherwise, lowercase then split into words on spaces
//       return part
//         .toLowerCase()
//         .split(" ")
//         .map((word) =>
//           // Split each word on hyphens or slashes, keeping the delimiters
//           word
//             .split(/([\-\/])/)
//             .map((seg) =>
//               // If this segment is a separator, keep it;
//               // otherwise capitalize first letter
//               seg === "-" || seg === "/"
//                 ? seg
//                 : seg.charAt(0).toUpperCase() + seg.slice(1)
//             )
//             .join("")
//         )
//         .join(" ");
//     })
//     .join("")
//     .trim();
// };

// export const handleDuplicateNames = (names: string[]): string[] => {
//   const nameCounts: Record<string, number> = {};
//   const uniqueNames: string[] = [];

//   for (const name of names) {
//     if (!nameCounts[name]) {
//       nameCounts[name] = 1;
//       uniqueNames.push(name);
//     } else {
//       uniqueNames.push(`${name}-${nameCounts[name]}`);
//       nameCounts[name]++;
//     }
//   }

//   return uniqueNames;
// };

// export const getDateFromTimezone = (restaurantTz: string, date: Date) => {
//   return (
//     DateTime.fromJSDate(date, { zone: restaurantTz }).toFormat("dd MMM yyyy") ??
//     ""
//   );
// };

// export const getTimeFromTimezone = (restaurantTz: string, date: Date) => {
//   return (
//     DateTime.fromJSDate(date, { zone: restaurantTz }).toFormat("hh:mm a") ?? ""
//   );
// };

// export const convertToRestoTimezone = (restaurantTz: string, date: Date) => {
//   return (
//     DateTime.fromJSDate(date, { zone: restaurantTz }).toFormat(
//       "dd MMM hh:mm a ZZZZ"
//     ) ?? ""
//   );
// };

// // export const getRestoTimezoneTime = (restaurantTz: string, date: Date) => {
// //   return DateTime.fromJSDate(date, { zone: restaurantTz }).toJSDate();
// // };

// // export const getRestoTimezoneTime = (restaurantTz: string, date: Date) => {
// //   restaurantTz = restaurantTz?.split(" ")[0] ?? "";

// //   return DateTime.fromJSDate(date, { zone: restaurantTz }).toJSDate();
// // };

// export function getRestoTimezoneTime(
//   restaurantTz: string,
//   utcDate: Date | string
// ): DateTime {
//   const tz = restaurantTz?.split(" ")[0] ?? "";

//   return DateTime.fromJSDate(new Date(utcDate), { zone: "utc" }) // handles both Date or ISO string
//     .setZone(tz);
// }

// export function transformInputToDBSchema(
//   input: ResCustomConditionGroupInput
// ): ResCustomConditionGroup {
//   const transformGroup = (
//     groupInput: ResCustomConditionGroupInput
//   ): ResCustomConditionGroup => {
//     return {
//       connector: groupInput.connector,
//       items: groupInput.items.map((node) => {
//         if (node.condition) {
//           return transformCondition(node.condition);
//         }
//         if (node.group) {
//           return transformGroup(node.group);
//         }
//         throw new Error("Invalid condition node");
//       }),
//     };
//   };

//   const transformCondition = (
//     conditionInput: ResCustomConditionInput
//   ): ResCustomCondition => {
//     return {
//       field: conditionInput.field,
//       fieldType: conditionInput.fieldType as ResCustomFieldTypeEnum,
//       operator: conditionInput.operator,
//       stringValue: conditionInput.stringValue,
//       numberValue: conditionInput.numberValue,
//       booleanValue: conditionInput.booleanValue,
//       dateValue: conditionInput.dateValue,
//       timeUnit: conditionInput.timeUnit,
//     };
//   };

//   return transformGroup(input);
// }

// export function transformDBCustomFiltersToResponse(
//   dbGroup?: ResCustomConditionGroup
// ): ResCustomConditionGroup | undefined {
//   if (!dbGroup) return undefined;

//   const transformItem = (
//     item: ResCustomCondition | ResCustomConditionGroup
//   ): ResCustomCondition | ResCustomConditionGroup => {
//     if ("field" in item) {
//       // Condition
//       return {
//         field: item.field,
//         fieldType: item.fieldType, // Ensure this is populated
//         operator: item.operator,
//         stringValue: item.stringValue,
//         numberValue: item.numberValue,
//         booleanValue: item.booleanValue,
//         dateValue: item.dateValue,
//         timeUnit: item.timeUnit,
//       };
//     }
//     // Group
//     return {
//       connector: item.connector,
//       items: item.items.map(transformItem),
//     };
//   };

//   return {
//     connector: dbGroup.connector,
//     items: dbGroup.items.map(transformItem),
//   };
// }

// export function mapDBCustomFiltersToGQL(
//   dbFilters?: ResCustomConditionGroup
// ): ResCustomConditionGroup | undefined {
//   if (!dbFilters) return undefined;

//   const mapItem = (
//     item: ResCustomCondition | ResCustomConditionGroup
//   ): ResCustomCondition | ResCustomConditionGroup => {
//     if ("field" in item) {
//       // Validate required fields
//       if (!item.fieldType) {
//         throw new Error(`Missing fieldType for condition: ${item.field}`);
//       }

//       return {
//         field: item.field,
//         fieldType: item.fieldType,
//         operator: item.operator,
//         ...(item.stringValue && { stringValue: item.stringValue }),
//         ...(item.numberValue && { numberValue: item.numberValue }),
//         ...(item.booleanValue && { booleanValue: item.booleanValue }),
//         ...(item.dateValue && { dateValue: item.dateValue }),
//         ...(item.timeUnit && { timeUnit: item.timeUnit }),
//       };
//     }

//     // Handle nested groups
//     return {
//       connector: item.connector,
//       items: item.items.map(mapItem),
//     };
//   };

//   return {
//     connector: dbFilters.connector,
//     items: dbFilters.items.map(mapItem),
//   };
// }

// export async function attributeOrderToCampaigns(
//   orderId: string
// ): Promise<void> {
//   try {
//     const order = await OrderModel.findById(orderId)
//       .select(
//         "guestData createdAt customer restaurant _id grossAmount appliedDiscount"
//       )
//       .lean();

//     if (!order) {
//       console.log(`[ATTRIBUTION] Order not found: ${orderId}`);
//       return;
//     }

//     let email = "";
//     if (!order.guestData) {
//       const customer = await CustomerModel.findOne({
//         _id: order.customer,
//       })
//         .select("email")
//         .lean();
//       email = customer?.email ?? "";
//     }

//     // Get customer email from order
//     const customerEmail = (order.guestData?.email || email)?.toLowerCase();

//     if (!customerEmail) {
//       console.log(`[ATTRIBUTION] No email found for order: ${order._id}`);
//       return;
//     }

//     // Define attribution window (14 days before order creation)
//     const windowStart = new Date(
//       order.createdAt.getTime() - 14 * 24 * 60 * 60 * 1000
//     );
//     const windowEnd = order.createdAt;

//     // Find campaigns that sent emails to this customer within attribution window
//     const campaigns = await ResEmailCampaignModel.find({
//       restaurantId: order.restaurant,
//       status: RestaurantEmailCampaignStatusEnum.completed,
//       $or: [
//         {
//           "stats.mailsOpened": {
//             $elemMatch: {
//               email: customerEmail,
//               date: { $gte: windowStart, $lte: windowEnd },
//             },
//           },
//         },
//         {
//           "stats.mailsClicked": {
//             $elemMatch: {
//               email: customerEmail,
//               date: { $gte: windowStart, $lte: windowEnd },
//             },
//           },
//         },
//       ],
//     })
//       .select("_id")
//       .lean();

//     if (campaigns.length === 0) {
//       console.log(`[ATTRIBUTION] No campaigns found for order: ${order._id}`);
//       // Still calculate and update loyalty points even if no campaigns
//       const loyaltyData = await calculateLoyaltyPoints(orderId);

//       await OrderModel.updateOne(
//         { _id: order._id },
//         {
//           $set: {
//             loyaltyRedeemed: loyaltyData.redeemed,
//             LoyaltyEarned: loyaltyData.earned, // Fixed field name case
//             campaignTarget: [], // Initialize empty array
//           },
//         }
//       );
//       return;
//     }

//     const restaurantData = await RestaurantModel.findById(order.restaurant)
//       .select("timezone")
//       .lean();

//     // Create campaign order object
//     const campaignOrder = {
//       _id: order._id,
//       amount: order.grossAmount || 0,
//       discountAmount: order.appliedDiscount?.discountAmount || 0,
//       customerEmail: customerEmail,
//       date: getRestoTimezoneTime(
//         restaurantData?.timezone?.timezoneName || "",
//         order.createdAt
//       ),
//     };

//     // Update all matching campaigns with the order
//     await Promise.all(
//       campaigns.map((campaign) =>
//         ResEmailCampaignModel.updateOne(
//           { _id: campaign._id },
//           {
//             $addToSet: {
//               campaignOrders: campaignOrder,
//             },
//           }
//         )
//       )
//     );

//     // Calculate loyalty points
//     const loyaltyData = await calculateLoyaltyPoints(orderId);

//     // Update order with attributed campaigns and loyalty data
//     await OrderModel.updateOne(
//       { _id: order._id },
//       {
//         $set: {
//           campaignTarget: campaigns.map((c) => c._id), // Fixed field name
//           loyaltyRedeemed: loyaltyData.redeemed,
//           LoyaltyEarned: loyaltyData.earned, // Fixed field name case
//         },
//       }
//     );

//     console.log(
//       `[ATTRIBUTION] Successfully attributed order ${order._id} to ${campaigns.length} campaigns`
//     );
//   } catch (error) {
//     console.error(`[ATTRIBUTION] Error attributing order ${orderId}:`, error);
//     throw error; // Re-throw to be caught by the batch processor
//   }
// }

// // Calculate loyalty points from transactions
// async function calculateLoyaltyPoints(orderId: string) {
//   try {
//     const transactions = await LoyaltyPointsTransactionModel.find({
//       order: orderId,
//     }).lean();

//     let redeemed = 0;
//     let earned = 0;

//     transactions.forEach((trans) => {
//       if (trans.transactionType === TransactionType.REDEEM) {
//         redeemed += Math.abs(trans.points); // Ensure positive value
//       } else if (trans.transactionType === TransactionType.EARN) {
//         earned += Math.abs(trans.points); // Ensure positive value
//       }
//     });

//     return { redeemed, earned };
//   } catch (error) {
//     console.error(
//       `Error calculating loyalty points for order ${orderId}:`,
//       error
//     );
//     return { redeemed: 0, earned: 0 }; // Return defaults on error
//   }
// }
