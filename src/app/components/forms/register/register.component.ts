import { Component } from "@angular/core";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"]
})
export class RegisterComponent extends TranslatableComponent {

    constructor(translator: TranslatorService) {
        super(translator);
        
        this.setLanguageChangeListener(() => {
            console.log("TODO");
        });
    }
}
