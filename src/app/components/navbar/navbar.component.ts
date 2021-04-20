import { Component } from "@angular/core";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent extends TranslatableComponent {

    appName!: string;
    registerText!: string;

    constructor(translator: TranslatorService) {
        super(translator);
        
        this.setLanguageChangeListener(() => {
            this.appName = translator.getString("app-title");
            this.registerText = translator.getString("register");
        });
    }
}
