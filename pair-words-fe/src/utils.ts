/**
 * Generates an array of unique random integers within a specified range
 * @param count Number of unique numbers to generate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of unique random numbers
 */
export function generateUniqueRandomNumbers(count: number, min = 0, max = 100): number[] {
  if (count < 0) {
    throw new Error("Count must be a non-negative number");
  }

  if (max < min) {
    throw new Error("Maximum value must be greater than the minimum value");
  }

  const range = max - min + 1;
  if (range < count) {
    throw new Error(`Cannot generate ${count} unique numbers in the range [${min}, ${max}]`);
  }

  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * range) + min);
  }

  return Array.from(numbers);
}

/**
 * Shuffles the items in an array
 * @param items Array of items to shuffle
 * @returns New array with items in random order
 */
export function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
