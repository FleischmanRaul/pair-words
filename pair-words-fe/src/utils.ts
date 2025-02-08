export function generateUniqueRandomNumbers(n: number, min: number = 0, max: number = 100): number[] {
  if (max - min + 1 < n) {
    throw new Error("Not enough unique numbers in the given range.");
  }
  const numbers = new Set<number>();
  while (numbers.size < n) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
}

export function shuffleStrings(strings: string[]): string[] {
  const shuffled = [...strings];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
