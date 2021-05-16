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

    constructor(public overLayContainer: OverlayContainer, private theme: ThemeService) {
        this.changeTheme(theme.getTheme())
        theme.activateTheme.subscribe((theme) => {
            this.changeTheme(theme)
        })
    }

    changeTheme(theme: string | null): void {
        this.className = theme === "light" ? "light-mode" : "dark-mode"
        if (theme === "light") {
            console.log(theme)
            this.overLayContainer.getContainerElement().classList.add(this.className)
        } else {
            console.log(theme)
            this.overLayContainer.getContainerElement().classList.remove(this.className)
        }
    }
}
