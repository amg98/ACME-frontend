import { Component } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-preferences",
    templateUrl: "./preferences.component.html",
    styleUrls: ["./preferences.component.scss"]
})
export class PreferencesComponent extends TranslatableComponent   {

    constructor(translator : TranslatorService) {
        super(translator)
    } 
}
