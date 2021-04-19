import { Component, OnDestroy } from "@angular/core";
import { TranslatorService } from "@services/translator.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-translatable",
    template: "",
})
export class TranslatableComponent implements OnDestroy {

    translatorSub: Subscription | null;

    constructor(private translator: TranslatorService) {
        this.translatorSub = null;
    }

    setLanguageChangeListener(onDataMap: VoidFunction): void {
        if(this.translatorSub) this.translatorSub.unsubscribe();
        this.translatorSub = this.translator.subscribe(() => {
            onDataMap();
        });
    }

    ngOnDestroy(): void {
        if(this.translatorSub) this.translatorSub.unsubscribe();
    }
}
