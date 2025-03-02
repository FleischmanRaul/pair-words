import { describe, it, expect } from "vitest";
import { WordMachine } from "../word-machine";
describe("WordMachine", () => {
  it("should throw an error if level is less than 1", () => {
    expect(() => new WordMachine(0)).toThrow("Level must be between 1 and 20");
  });

  it("should throw an error if level is greater than 20", () => {
    expect(() => new WordMachine(21)).toThrow("Level must be between 1 and 20");
  });

  it("should create a WordMachine instance with valid level", () => {
    const wm = new WordMachine(1);
    expect(wm).toBeInstanceOf(WordMachine);
  });

  it("should return the correct number of words", () => {
    const wm = new WordMachine(1);
    const words = wm.getWords(5);
    expect(Object.keys(words).length).toBe(5);
  });

  it("should return unique words", () => {
    const wm = new WordMachine(1);
    const words = wm.getWords(5);
    const keys = Object.keys(words);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("should return the correct number of selected words for level 1", () => {
    const wm = new WordMachine(1);
    const numberOfSelectedWords = wm.getNumberOfAvailableWords();
    expect(numberOfSelectedWords).toEqual(50);
  });

  it("should return the correct number of selected words for level 20", () => {
    const wm = new WordMachine(20);
    const numberOfSelectedWords = wm.getNumberOfAvailableWords();
    expect(numberOfSelectedWords).toEqual(49);
  });
});
