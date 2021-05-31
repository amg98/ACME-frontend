import { Component } from "@angular/core"
import { MatSelectChange } from "@angular/material/select"
import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-font-selector",
    templateUrl: "./font-selector.component.html",
    styleUrls: ["./font-selector.component.scss"],
})

export class FontSelectorComponent{
    selectedFont: string | null 
    fonts = [ "Oswald", "Roboto", "Monospace"];
    fontLabels = this.fonts

    onFontChange(event: MatSelectChange): void {
        const fontFamily = event.value
        this.preference.changeFontFamily.emit(fontFamily)
        this.preference.savePreference("font", fontFamily)
    }

    constructor(private preference: PreferencesService) {
        this.selectedFont = preference.getPreference("font")         
    }
}
