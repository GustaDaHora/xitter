const badWords = [
  // --- English Profanity ---
  "shit", "fuck", "hell", "bitch", "asshole", "bastard", "damn", "dick", "pussy",
  "cunt", "slut", "whore", "motherfucker", "fucker", "cock", "fag", "faggot",
  "retard", "bullshit", "crap", "nigger", "nigga",

  // --- Portuguese Profanity ---
  "merda", "porra", "caralho", "puta", "buceta", "cu", "cacete", "foda", "foder",
  "viado", "desgraça", "arrombado", "filho da puta", "corno", "piranha",
  "vagabunda", "babaca", "otário", "cabrão", "fodido", "pau no cu", "viadinho",
  "viado", "pinto", "bicha", "puto", "putinha", "caralhudo", "caralhuda",
  "krl", "bosta", "merda", "porra", "cacete", "caralho", "foda-se", "foder", "fodeu",
  "gozou", "gozada", "gozando", "gozando", "fodeu", "foderam", "foderam-se",

  // --- English Suggestive/Inappropriate ---
  "balls", "boobs", "tits", "nipple", "panties", "horny", "sex", "sexy", "moan",
  "jerk", "jack off", "handjob", "blowjob", "suck", "69", "strip", "nude", "nudes",
  "wet", "creampie", "penetrate", "molest", "rape", "rapist", "incest", "orgasm",
  "masturbate", "ejaculate", "climax", "anal", "thrust", "cum", "facial", "grope",
  "fetish", "genitals", "erection", "penis", "vagina", "testicles", "lick", "bang",
  "penetration", "hookup", "hooking up", "make out", "kiss", "ass",

  // --- Portuguese Suggestive/Inappropriate ---
  "ânus", "bolas", "seios", "mamilos", "calcinha", "tesão", "sexo", "sensual", "gemido",
  "punheta", "boquete", "chupar", "chupei", "nua", "nus", "gozar", "gozo", "molestar",
  "estuprar", "estuprador", "incesto", "orgasmo", "masturbar", "ejacular", "clímax",
  "anal", "enfiar", "gozar", "foder", "foda-se", "pau", "vagina", "pênis", "lamber",
  "meter", "penetração", "fetiche", "genitais", "ereção", "testículos", "uretra", "homossexuais",
  "lésbica", "beijar", "sexo oral", "sexo anal", "sexo vaginal", "sexo grupal",
  "camisinha", "peido", "negros", "negras", "brancos", "brancas", "asiáticos", "asiáticas",
  "latinos", "latinas", "judeus", "cristãos", "muçulmanos", "budistas", "ateus",
  "religiosos", "crente", "evangélico", "católico", "espírita", "umbanda", "candomblé",
  "macumba", "candomblé", "umbanda", "santo", "santos", "santíssima", "santíssimo", "santo", "espírito",
  "nordestino", "nordestina", "nordestinos", "sulista", "sulista", "paulista", "carioca", "macaco",
  "macaca", "macacos", "macacas", "pobre", "imundo", "imunda", "pobreza", "favelado", "favelada", 
  "favelados", "faveladas", "favelas", "favela", "mendigo", "mendiga", "pelado", "pelada", "pelados", "peladas", "sem roupa", "morri", "morrer", "morto", "morta", "boquinha", "enfia mais fundo", "prazer"
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

  return text.replace(badWordsRegex, (match) => "Vampeta");
}
