import * as words from "./words";
import { generateUniqueRandomNumbers } from "./utils";

type Dictionary = { [key: string]: string };

export class WordMachine {
  private selectedWords: Dictionary;
  constructor(selectedCategories: string[]) {
    this.selectedWords = {};
    const categories: { [key: string]: Dictionary } = {
      adjectives: words.adjectives_de_en,
      animals: words.animals_de_en,
      bodyParts: words.bodyParts_de_en,
      business: words.business_de_en,
      legal: words.legal_de_en,
      calendar: words.calendar_de_en,
      verbs: words.verbs_de_en,
      emotions: words.emotions_de_en,
      personality: words.personality_de_en,
    };

    selectedCategories.forEach((category) => {
      if (categories[category as keyof typeof categories]) {
        this.selectedWords = { ...this.selectedWords, ...categories[category] };
      }
    });

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
