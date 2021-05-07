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

    ngOnDestroy(): void {
        this.translatorSub.unsubscribe()
    }
}
