import { Component, OnDestroy } from "@angular/core"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

@Component({
    selector: "app-translatable",
    template: "",
})
export class TranslatableComponent implements OnDestroy {

    private translatorSub: Subscription;
    msg!: Record<string, string>

    constructor(private translator: TranslatorService) {
        this.translatorSub = this.translator.subscribe(() => {
            this.msg = translator.getMessages()
        })
    }

    setLanguageChangeListener(onDataMap: VoidFunction): void {
        if(this.translatorSub) this.translatorSub.unsubscribe();
        this.translatorSub = this.translator.subscribe(() => {
            onDataMap();
        });
    }

    ngOnDestroy(): void {
        this.translatorSub.unsubscribe()
    }
}
