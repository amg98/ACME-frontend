import { Component, OnDestroy } from "@angular/core";
import { TranslatorService } from "@services/translator.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnDestroy {

    appName!: string;
    registerText!: string;
    translatorSub: Subscription;

    constructor(translator: TranslatorService) {
        this.translatorSub = translator.subscribe(() => {
            this.appName = translator.getString("app-title");
            this.registerText = translator.getString("register");
        });
    }

    ngOnDestroy(): void {
        this.translatorSub.unsubscribe();
    }
}
