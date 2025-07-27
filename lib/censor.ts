// The list of words you want to censor.
const badWords = [
  // English
  "shit",
  "fuck",
  "hell",
  "bitch",
  "asshole",
  "bastard",
  "damn",
  "dick",
  "pussy",
  "cunt",
  "slut",
  "whore",
  "motherfucker",
  "fucker",
  "cock",
  "fag",
  "faggot",
  "retard",
  "bullshit",
  "crap",
  "nigger", // highly offensive — include only for filtering
  "nigga", // highly offensive — include only for filtering

  // Portuguese
  "merda",
  "bosta",
  "porra",
  "caralho",
  "puta",
  "buceta",
  "cu",
  "cacete",
  "foda",
  "foder",
  "viado",
  "desgraça",
  "arrombado",
  "filho da puta",
  "corno",
  "piranha",
  "vagabunda",
  "babaca",
  "otário",
  "fodido",
  "pau no cu",
];

// A regular expression to find all occurrences of the bad words, case-insensitively.
const badWordsRegex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");

/**
 * Replaces specified words in a text with '#' characters of the same length.
 * @param text The input text to censor.
 * @returns The censored text.
 */
export function censorText(text: string): string {
  if (!text) {
    return "";
  }

  return text.replace(badWordsRegex, (match) => "#".repeat(match.length));
}
