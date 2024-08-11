// Function to generate a random hash
export function generateShortHash(length: number = 6): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    hash += charset[randomIndex];
  }
  return hash;
}
