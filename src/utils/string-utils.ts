/**
 * Replaces placeholders in a string with elements from the provided array.
 *
 * The function will replace each `{var}` placeholder in the string with
 * the corresponding element in the `params` array, in order. For example,
 * the first `{var}` will be replaced with the first element in the array,
 * the second `{var}` with the second element, and so on. If there are more
 * placeholders than elements in `params`, the remaining placeholders are replaced
 * with an empty string.
 *
 * @param {string} content - The string containing `{var}` placeholders.
 * @param {string[]} params - An array of strings to replace each `{var}` placeholder.
 * @returns {string} - The formatted string with all placeholders replaced by corresponding array elements or empty strings.
 */
export const replaceStringContentPlaceholders = (
  content: string,
  params: string[]
): string => {
  let result = "";
  let placeholderIndex = 0;
  let lastPos = 0;
  const placeholder = "{var}";
  const placeholderLength = placeholder.length;

  while (true) {
    const currentPos = content.indexOf(placeholder, lastPos);

    // If no more placeholders are found, append the rest of the content
    if (currentPos === -1) {
      result += content.slice(lastPos);
      break;
    }

    // Append portion before placeholder and replace placeholder
    // with the parameter or an empty string if no parameter is left
    const replacement =
      placeholderIndex < params.length ? params[placeholderIndex] : "";
    result += content.slice(lastPos, currentPos) + replacement;
    placeholderIndex++;
    lastPos = currentPos + placeholderLength;
  }

  return result;
};

/**
 *
 * @param role user role
 * @returns formatted user role
 */
export const formatUserRole = (role: string): string => {
  switch (role) {
    case "owner":
      return "Owner";
    case "staff":
      return "Staff";
    case "manager":
      return "Manager";
    case "marketingPartner":
      return "Marketing Partner";

    default:
      return "";
  }
};
