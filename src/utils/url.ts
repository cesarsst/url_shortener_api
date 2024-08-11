/**
 * Verify if the url is valid
 * @param url
 * @returns boolean
 */
export function verifyIfUrlIsValid(url: string): boolean {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
