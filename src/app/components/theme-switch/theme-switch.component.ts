import { Component } from "@angular/core"
import { FormControl } from "@angular/forms"

import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-theme-switch",
    templateUrl: "./theme-switch.component.html",
    styleUrls: ["./theme-switch.component.scss"],
})

export class ThemeSwitchComponent {
    toggleControl = new FormControl();
    constructor(private preference: PreferencesService) {
        this.toggleControl.setValue(preference.getPreference("theme") === "light" ? false : true)

        this.toggleControl.valueChanges.subscribe((darkModeActivated) => {
            const mode = darkModeActivated ? "dark" : "light"
            this.preference.activateTheme.emit(mode)
            this.preference.savePreference("theme", mode)
        })
    }

}
