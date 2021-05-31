import { Component, HostBinding } from "@angular/core"
import { OverlayContainer } from "@angular/cdk/overlay"

import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})

export class AppComponent {

    @HostBinding("class") className = ""
    constructor(public overLayContainer: OverlayContainer, private preference: PreferencesService) {

        this.changeTheme(preference.getPreference("theme"))
        this.changeFontFamily(preference.getPreference("font"))
        this.changeFontSize(preference.getPreference("size"))

        preference.activateTheme.subscribe((theme) => {
            this.changeTheme(theme)
        })

        preference.changeFontFamily.subscribe((fontFamily => {
            this.changeFontFamily(fontFamily)
        }))

        preference.changeSize.subscribe((size) => {
            this.changeFontSize(size)
        })
    }

    changeTheme(theme: string | null): void {
        this.className = `${this.preference.getPreference("font")} ${theme === "light" ? "light" : "dark"}`

        this.overLayContainer.getContainerElement().classList
            .add(theme === "light" ? "light" : "dark")
        this.overLayContainer.getContainerElement().classList
            .remove(theme !== "light" ? "light" : "dark")
    }

    changeFontSize(size: string | null): void {
        document.getElementsByTagName("html")[0].style.fontSize = `${size}px`
        document.getElementsByTagName("body")[0].style.fontSize = `${size}px`
    }

    changeFontFamily(fontFamily: string | null): void {
        this.className = `${fontFamily} ${this.preference.getPreference("theme")}`
        document.getElementsByTagName("body")[0].style.fontFamily = `${fontFamily}`
    }
}
