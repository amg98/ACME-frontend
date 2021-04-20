import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import ES from "@assets/strings/es.json";
import ENG from "@assets/strings/eng.json";

export enum Language {
    Spanish = 0,
    English,
}

const messages: Record<string, string>[] = [
    ES,
    ENG
];

const LANGUAGE_TAG = "language";
const defaultLanguage = Language.Spanish;

@Injectable({
    providedIn: "root"
})
export class TranslatorService {

    private language: BehaviorSubject<Language>;
    private languages: string[];

    constructor() {
        this.languages = Object.keys(Language).filter(item => isNaN(Number(item)));

        const storedLang = localStorage.getItem(LANGUAGE_TAG);

        if (storedLang !== null && Object.keys(Language).includes(storedLang)) {
            this.language = new BehaviorSubject<Language>(Number(storedLang));
        } else {
            this.language = new BehaviorSubject<Language>(defaultLanguage);
            localStorage.setItem(LANGUAGE_TAG, this.language.getValue().toString());
        }
    }

    getLanguages(): string[] {
        return this.languages;
    }

    subscribe(fun: VoidFunction): Subscription {
        return this.language.subscribe(fun);
    }

    getLanguage(): string {
        return Language[this.language.getValue()];
    }

    changeLanguage(language: Language): void {
        this.language.next(language);
        localStorage.setItem(LANGUAGE_TAG, this.language.getValue().toString());
    }

    getString(label: string): string {
        return messages[this.language.getValue()][label];
    }
}
