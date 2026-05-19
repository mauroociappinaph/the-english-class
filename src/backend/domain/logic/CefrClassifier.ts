import { CefrLevel } from "@/shared/types/expression";

/**
 * Robust static CEFR classifier for extremely common English words.
 * Prevents LLM hallucinations on foundational vocabulary.
 */
export class CefrClassifier {
  // A1: Beginner / Everyday words
  private static readonly A1_WORDS = new Set([
    // Question words
    "how", "who", "what", "where", "when", "why", "which", "whose",
    // Pronouns
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs",
    "myself", "yourself",
    // Core verbs
    "be", "have", "do", "go", "come", "say", "make", "get", "know", "think", "see",
    "want", "look", "use", "find", "give", "tell", "work", "call", "try", "ask", "need",
    "feel", "become", "leave", "put", "mean", "keep", "let", "begin", "seem", "help",
    "talk", "turn", "start", "show", "hear", "play", "run", "move", "live", "believe",
    "bring", "write", "sit", "stand", "lose", "pay", "meet", "include", "continue", "set",
    "learn", "change", "lead", "understand", "watch", "follow", "stop", "create", "speak",
    "read", "spend", "grow", "open", "walk", "win", "offer", "love", "like", "hate",
    "sleep", "eat", "drink", "buy", "sell", "cost", "finish", "jump", "swim", "fly",
    "drive", "ride", "stay", "wait", "answer", "die",
    // Basic Greetings
    "hello", "hi", "bye", "goodbye", "please", "thanks", "thank you", "sorry", "yes", "no",
    // Common nouns / people
    "cat", "dog", "boy", "girl", "man", "woman", "child", "friend", "family", "house",
    "school", "book", "pen", "pencil", "paper", "day", "week", "month", "year", "time",
    "morning", "afternoon", "evening", "night", "today", "yesterday", "tomorrow", "water",
    "food", "bread", "milk", "apple", "banana", "name", "age", "country", "city", "street",
    "sun", "moon", "star", "rain", "snow", "room", "bed", "chair", "table", "door", "window",
    // Common adjectives
    "good", "bad", "new", "old", "big", "small", "happy", "sad", "hot", "cold", "easy",
    "hard", "fast", "slow", "cheap", "clean", "dirty", "right", "wrong",
    // Colors
    "red", "blue", "green", "yellow", "black", "white", "orange", "pink", "purple", "brown", "grey", "gray",
    // Numbers
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    // Connectors / Prepositions
    "the", "a", "an", "and", "but", "or", "so", "because", "if", "to", "in", "on", "at",
    "for", "with", "about", "by", "from", "of", "up", "down", "out", "off", "into", "over",
    "under", "above", "after", "before", "as"
  ]);

  // A2: Elementary / Simple verbs and daily objects
  private static readonly A2_WORDS = new Set([
    // Travel & Places
    "airport", "travel", "flight", "ticket", "hotel", "holiday", "vacation", "beach",
    "mountain", "forest", "river", "lake", "sea", "ocean", "bank", "station", "shop",
    "store", "market", "office", "garden", "kitchen", "bathroom", "bedroom", "floor", "wall",
    // Descriptive adjectives
    "expensive", "interesting", "boring", "beautiful", "ugly", "normal", "special",
    "perfect", "simple", "difficult", "active", "lazy", "busy", "free", "rich", "poor",
    "safe", "dangerous", "quiet", "noisy", "healthy", "sick", "strong", "weak", "high",
    "low", "near", "far", "early", "late", "first", "last", "next", "past", "future",
    // Daily items
    "key", "bag", "pocket", "phone", "computer", "laptop", "screen", "keyboard", "mouse",
    "letter", "email", "message", "text", "picture", "photo", "video", "map", "passport", "visa",
    "money", "card", "cash", "bill", "coin", "price",
    // Food & Drink
    "breakfast", "lunch", "dinner", "tea", "coffee", "juice", "sugar", "salt", "pepper",
    // Nouns & Concepts
    "business", "manager", "meeting", "coworker", "company", "job", "career", "plan",
    "goal", "mistake", "problem", "question", "detail", "piece", "part", "group", "system",
    "program", "game", "sport", "music", "movie", "film", "song", "party", "gift", "present",
    "nature", "weather", "animal", "plant", "flower", "tree", "wood", "stone", "fire",
    "wind", "air", "ground", "world", "space", "life", "health", "body", "mind", "soul",
    "head", "face", "eye", "ear", "nose", "mouth", "hair", "hand", "foot", "leg", "arm",
    "finger", "back", "heart", "blood"
  ]);

  /**
   * Statically classifies a word or expression to a CEFR level if possible.
   * Returns null if the word is not in the common static dictionary.
   */
  static classify(text: string): CefrLevel | null {
    const clean = text.trim().toLowerCase();
    
    // Quick exact matches
    if (this.A1_WORDS.has(clean)) {
      return "A1";
    }
    if (this.A2_WORDS.has(clean)) {
      return "A2";
    }

    // Heuristics for basic numbers or patterns
    if (/^\d+$/.test(clean)) {
      return "A1"; // Numbers are A1
    }

    return null;
  }
}
