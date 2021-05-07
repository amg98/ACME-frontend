import { Component, OnDestroy } from "@angular/core"
import { MatSelectChange } from "@angular/material/select"
import { Language, TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

@Component({
    selector: "app-language-selector",
    templateUrl: "./language-selector.component.html",
    styleUrls: ["./language-selector.component.scss"]
})
export class LanguageSelectorComponent implements OnDestroy {

    languageLabels: string[];
    languages!: string[];
    translatorSub: Subscription;
    selectedLanguage: string;

    constructor(private translator: TranslatorService) {
        
        this.languageLabels = translator.getLanguages()
        this.selectedLanguage = translator.getLanguage()

        this.translatorSub = translator.subscribe(() => {
            this.languages = this.languageLabels.map(langLabel => translator.getString(langLabel))
        })
    }

    onLanguageChange(event: MatSelectChange): void {
        const language = Object.keys(Language).filter(it => isNaN(Number(it))).indexOf(event.value)
        this.translator.changeLanguage(language)
    }

    ngOnDestroy(): void {
        this.translatorSub.unsubscribe()
    }
}
