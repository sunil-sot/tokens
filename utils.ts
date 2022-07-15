/**
 * Returns random alphanumeric random string of specified length
 * @param options.length number
 * @param options.capitalAlpha boolean
 * @param options.smallAlpha boolean
 * @param options.numeric boolean
 * @param options.specialChar boolean
 */
export function getRandomString({
  length = 8,
  capitalAlpha = true,
  smallAlpha = true,
  numeric = true,
  specialChar = true,
}: {
  length?: number;
  capitalAlpha?: boolean;
  smallAlpha?: boolean;
  numeric?: boolean;
  specialChar?: boolean;
}) {
  var result = "";
  // All charcaters
  var capitalAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var smallAlphabets = "abcdefghijklmnopqrstuvwxyz";
  var numbers = "0123456789";
  var specials = "!\"#$%&'()*+,-/:;<=>?@[]^_`{|}~";

  // Conditional inclusion
  var characters = "";
  if (capitalAlpha) characters += capitalAlphabets;
  if (smallAlpha) characters += smallAlphabets;
  if (numeric) characters += numbers;
  if (specialChar) characters += specials;

  //Math magic
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
