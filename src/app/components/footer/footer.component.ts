import { Component } from "@angular/core";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})
export class FooterComponent extends TranslatableComponent {
    help!: string;
    privacyAndTerms!: string;
    userAgreement!: string;
    resume!: string;
    whoWeAre!: string;
    flag!: string;
    appTitle!: string;

    constructor(translator: TranslatorService) {
        super(translator);
        this.setLanguageChangeListener(() => {
            this.help = translator.getString("help");
            this.privacyAndTerms = translator.getString("privacyAndTerms");
            this.userAgreement = translator.getString("userAgreement");
            this.resume = translator.getString("resume");
            this.whoWeAre = translator.getString("whoWeAre");
            this.flag = translator.getString("flag");
            this.appTitle = translator.getString("app-title");
        });
    }
}
