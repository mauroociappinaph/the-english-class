export function createCloze(target: string, example: string): string {
  if (!example) return "";
  
  // Try exact match first (case insensitive)
  const regex = new RegExp(target, 'gi');
  if (regex.test(example)) {
    return example.replace(regex, '__________');
  }

  // If no exact match (e.g. separated phrasal verb), try to find parts
  const parts = target.split(' ');
  if (parts.length > 1) {
    let cloze = example;
    parts.forEach(part => {
      const partRegex = new RegExp(`\\b${part}\\b`, 'gi');
      cloze = cloze.replace(partRegex, '__________');
    });
    return cloze;
  }

  return example;
}
