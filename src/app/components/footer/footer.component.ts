import { Component, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { PreferencesService } from "@services/preferences.service"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})

export class FooterComponent extends TranslatableComponent implements OnInit {
    constructor(translator: TranslatorService, private preference: PreferencesService) {
        super(translator)
        preference.activateTheme.subscribe((theme) => {
            this.changeColor(theme)
        })

    }

    ngOnInit(): void {
        this.changeColor(this.preference.getPreference("theme"))
    }

    changeColor(theme:string |null):void{
        document.getElementsByTagName("footer")[0].style.backgroundColor =
                theme === "light" ? "#1565c0" : "#0d47a1"
    }
}
