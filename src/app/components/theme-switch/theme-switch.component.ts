import { Component } from "@angular/core"
import { FormControl } from "@angular/forms"

import { ThemeService } from "@services/theme.service"

@Component({
    selector: "app-theme-switch",
    templateUrl: "./theme-switch.component.html",
    styleUrls: ["./theme-switch.component.scss"],
})

export class ThemeSwitchComponent {
    toggleControl = new FormControl();
    constructor(private theme: ThemeService) {
        this.toggleControl.setValue(theme.getTheme() === "light" ? false : true)
        
        this.toggleControl.valueChanges.subscribe((darkModeActivated) => {
            const mode = darkModeActivated ? "dark" : "light"
            this.theme.activateTheme.emit(mode)
            this.theme.saveTheme(mode)
        })
    }

}
