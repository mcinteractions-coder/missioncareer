export const DIWALI_WA_NUMBER = "919870003748";

/** WhatsApp link used when a player wins and wants the Diwali prize. */
export function prizeLink(game: string, score: number) {
  const text =
    `Hi Mission Career! I played the "${game}" Diwali game on your website and scored ${score}. ` +
    `Please send me my Diwali offer prize!`;
  return `https://wa.me/${DIWALI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
