import * as words from "./words";
import { generateUniqueRandomNumbers } from "./utils";

type Dictionary = { [key: string]: string };

export class WordMachine {
  private selectedWords: Dictionary;
  constructor(
    adjectives: boolean,
    animals: boolean,
    bodyParts: boolean,
    business: boolean,
    legal: boolean,
    calendar: boolean,
    verbs: boolean,
    emotions: boolean,
    personality: boolean
  ) {
    this.selectedWords = {};
    if (adjectives) {
      this.selectedWords = { ...this.selectedWords, ...words.adjectives_de_en };
    }
    if (animals) {
      this.selectedWords = { ...this.selectedWords, ...words.animals_de_en };
    }
    if (bodyParts) {
      this.selectedWords = { ...this.selectedWords, ...words.bodyParts_de_en };
    }
    if (business) {
      this.selectedWords = { ...this.selectedWords, ...words.business_de_en };
    }
    if (legal) {
      this.selectedWords = { ...this.selectedWords, ...words.legal_de_en };
    }
    if (calendar) {
      this.selectedWords = { ...this.selectedWords, ...words.calendar_de_en };
    }
    if (verbs) {
      this.selectedWords = { ...this.selectedWords, ...words.verbs_de_en };
    }
    if (emotions) {
      this.selectedWords = { ...this.selectedWords, ...words.emotions_de_en };
    }
    if (personality) {
      this.selectedWords = { ...this.selectedWords, ...words.personality_de_en };
    }
    if (Object.keys(this.selectedWords).length === 0) {
      throw new Error("No words selected. Please enable at least one category.");
    }
  }

  getWords(n: number): Dictionary {
    const keys = Object.keys(this.selectedWords);
    const selectedKeys = generateUniqueRandomNumbers(n, 0, keys.length - 1).map((i) => keys[i]);
    const returnedWords: Dictionary = {};
    selectedKeys.forEach((key) => {
      returnedWords[key] = this.selectedWords[key];
    });
    return returnedWords;
  }

  getNumberOfSelectedWords(): number {
    return Object.keys(this.selectedWords).length;
  }
}
