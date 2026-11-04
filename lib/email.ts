/** Encodes an address for <EmailLink>, so it isn't plain text in the HTML. */
export function encodeEmail(email: string) {
  return Buffer.from(email, "utf8").toString("base64");
}
