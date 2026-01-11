export function detectMusicIntent(text: string): string | null {
  const lower = text.toLowerCase();

  // Patterns for music requests
  const patterns = [
    /toca(?:r)?\s+(.*)/i,
    /coloque\s+(.*)/i,
    /ouvir\s+(.*)/i,
    /ponha\s+(.*)/i
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
        // Clean up common fillers
        const queryRaw = match[1].replace(/uma música|algo|um som|pra eu relaxar|triste/g, "").trim();
        const query = queryRaw;

        // If query became empty but intent was clear (e.g. "toca algo"), fallback to a default based on context words
        if (!query) {
            if (lower.includes("relaxar") || lower.includes("calma")) return "lofi hip hop radio";
            if (lower.includes("triste")) return "sad songs playlist";
            if (lower.includes("animada") || lower.includes("feliz")) return "happy hits";
            return "lofi hip hop"; // Default fallback
        }

        return query;
    }
  }

  return null;
}
