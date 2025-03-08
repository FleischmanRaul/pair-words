import * as words from "./words";
import { generateUniqueRandomNumbers } from "./utils";

type Dictionary = Record<string, string>;

export class WordMachine {
  private selectedWords: Dictionary;

  constructor(level: number) {
    if (level < 1 || level > 20) {
      throw new Error("Level must be between 1 and 20");
    }

    this.selectedWords = {};
    this.loadWordsByLevel(level);
  }

  /**
   * Loads words from the word list based on the specified level
   */
  private loadWordsByLevel(level: number): void {
    for (let i = level - 1; i < words.a1_de_en.length; i += 20) {
      const [original, translation] = words.a1_de_en[i];
      if (!this.selectedWords[original]) {
        this.selectedWords[original] = translation;
      }
    }
  }

  /**
   * Gets a specified number of random word pairs
   * @param count Number of word pairs to return
   * @returns Dictionary of randomly selected word pairs
   */
  getWords(count: number): Dictionary {
    const keys = Object.keys(this.selectedWords);

    if (count > keys.length) {
      throw new Error(`Requested ${count} words but only ${keys.length} are available`);
    }

    const selectedIndices = generateUniqueRandomNumbers(count, 0, keys.length - 1);
    const result: Dictionary = {};

    for (const index of selectedIndices) {
      const key = keys[index];
      result[key] = this.selectedWords[key];
    }

    return result;
  }

  /**
   * Returns the total number of available word pairs
   */
  getNumberOfAvailableWords(): number {
    return Object.keys(this.selectedWords).length;
  }
}
