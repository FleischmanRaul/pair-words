import { describe, test, expect } from "vitest";
import { shuffleItems, generateUniqueRandomNumbers } from "../utils";

describe("generateUniqueRandomNumbers", () => {
  test("generates the correct number of unique values", () => {
    const count = 5;
    const result = generateUniqueRandomNumbers(count, 1, 10);

    expect(result.length).toBe(count);

    const uniqueValues = new Set(result);
    expect(uniqueValues.size).toBe(count);
  });

  test("generates values within the specified range", () => {
    const min = 5;
    const max = 10;
    const result = generateUniqueRandomNumbers(3, min, max);

    result.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(min);
      expect(num).toBeLessThanOrEqual(max);
    });
  });

  test("works when count equals range size", () => {
    const min = 1;
    const max = 5;
    const count = max - min + 1;
    const result = generateUniqueRandomNumbers(count, min, max);

    expect(result.length).toBe(count);

    const expectedSet = new Set([1, 2, 3, 4, 5]);
    const resultSet = new Set(result);
    expect(resultSet).toEqual(expectedSet);
  });

  test("works with count of zero", () => {
    const result = generateUniqueRandomNumbers(0, 1, 10);
    expect(result).toEqual([]);
  });

  test("throws error when count is negative", () => {
    expect(() => generateUniqueRandomNumbers(-1, 1, 10)).toThrow("Count must be a non-negative number");
  });

  test("throws error when max is less than min", () => {
    expect(() => generateUniqueRandomNumbers(5, 10, 5)).toThrow("Maximum value must be greater than the minimum value");
  });

  test("throws error when range is smaller than count", () => {
    expect(() => generateUniqueRandomNumbers(10, 1, 5)).toThrow(
      "Cannot generate 10 unique numbers in the range [1, 5]"
    );
  });
});

describe("shuffleItems", () => {
  test("returns a new array", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleItems(original);

    expect(shuffled).not.toBe(original);
    expect(Array.isArray(shuffled)).toBe(true);
  });

  test("returns an array of the same length", () => {
    const original = ["a", "b", "c", "d", "e"];
    const shuffled = shuffleItems(original);
    expect(shuffled.length).toBe(original.length);
  });

  test("returned array contains all original elements", () => {
    const original = [10, 20, 30, 40, 50];
    const shuffled = shuffleItems(original);

    original.forEach((item) => {
      expect(shuffled).toContain(item);
    });

    expect(shuffled).toEqual(expect.arrayContaining(original));
    expect(shuffled.length).toBe(original.length);
  });

  test("works with empty arrays", () => {
    const original: number[] = [];
    const shuffled = shuffleItems(original);

    expect(shuffled).toEqual([]);
    expect(shuffled).not.toBe(original); // Still returns a new array
  });

  test("works with single-item arrays", () => {
    const original = ["solo"];
    const shuffled = shuffleItems(original);

    expect(shuffled).toEqual(["solo"]);
    expect(shuffled).not.toBe(original); // Still returns a new array
  });

  test("works with different data types", () => {
    const numberArray = [1, 2, 3];
    const stringArray = ["a", "b", "c"];
    const objectArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(() => shuffleItems(numberArray)).not.toThrow();
    expect(() => shuffleItems(stringArray)).not.toThrow();
    expect(() => shuffleItems(objectArray)).not.toThrow();
  });
});
