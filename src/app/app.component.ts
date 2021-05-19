import { Component, HostBinding, } from "@angular/core"
import { OverlayContainer } from "@angular/cdk/overlay"

import { ThemeService } from "@services/theme.service"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})

export class AppComponent {
    @HostBinding("class") className = "";

    constructor(public overLayContainer: OverlayContainer, theme: ThemeService) {
        this.changeTheme(theme.getTheme())
        theme.activateTheme.subscribe((theme) => {
            this.changeTheme(theme)
        })
    }

    changeTheme(theme: string | null): void {
        this.className = theme === "light" ? "light-mode" : "dark-mode"  
        this.overLayContainer.getContainerElement().classList.add(theme === "light" ? "light-mode" : "dark-mode")
        this.overLayContainer.getContainerElement().classList.remove(theme !== "light" ? "light-mode" : "dark-mode") 
    }
}
