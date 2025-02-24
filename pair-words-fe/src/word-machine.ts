import * as words from "./words";
import { generateUniqueRandomNumbers } from "./utils";

type Dictionary = { [key: string]: string };

export class WordMachine {
  private selectedWords: Dictionary;
  constructor(level: number) {
    if (level < 1 || level > 20) {
      throw new Error("Level must be between 1 and 20");
    }
    this.selectedWords = {};
    for (let i = level - 1; i < words.a1_de_en.length; i += 20) {
      const [de, en] = words.a1_de_en[i];
      if (!this.selectedWords[de]) {
        this.selectedWords[de] = en;
      } // TODO: handle duplicate keys in a better way
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
