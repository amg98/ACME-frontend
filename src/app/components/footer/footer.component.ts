import { Component } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})
export class FooterComponent extends TranslatableComponent {

    constructor(translator: TranslatorService) {
        super(translator)
    }
}
