import { describe, it, expect } from "vitest";
import { WordMachine } from "../word-machine";

describe("WordMachine", () => {
  it("should throw an error if no categories are selected", () => {
    expect(() => new WordMachine([])).toThrow("No words selected. Please enable at least one category.");
  });

  it("should return the correct number of words for each category combination", () => {
    const combinations: string[][] = [
      ["adjectives", "animals", "bodyParts", "business", "legal", "calendar", "verbs", "emotions", "personality"],
      ["personality"],
    ];

    combinations.forEach((combination) => {
      const wordMachine = new WordMachine(combination);
      const result = wordMachine.getWords(5);
      expect(Object.keys(result).length).toBe(5);
    });
  });
});
