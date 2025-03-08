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

/**
 * Safely parses integer values with validation
 * @param value The string value to parse
 * @param defaultValue Fallback value if parsing fails
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns The parsed and validated integer
 */
export const safeParseInt = (value: string, defaultValue: number, min: number, max: number): number => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;
  return Math.max(min, Math.min(parsed, max));
};

/**
 * Updates an input element's value
 * @param inputId ID of the input element
 * @param action 'increment' or 'decrement'
 */
export const updateInputValue = (inputId: string, action: string): void => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) return;

  const currentValue = parseInt(input.value, 10) || 1;
  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || 100;

  if (action === "increment") {
    input.value = Math.min(currentValue + 1, max).toString();
  } else if (action === "decrement") {
    input.value = Math.max(currentValue - 1, min).toString();
  }

  // Trigger an input event to notify any listeners
  input.dispatchEvent(new Event("input", { bubbles: true }));
};
