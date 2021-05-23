import { Component, HostBinding, OnInit } from "@angular/core"
import { OverlayContainer } from "@angular/cdk/overlay"

import { ThemeService } from "@services/theme.service"
import { Router } from "@angular/router"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})

export class AppComponent implements OnInit {
    @HostBinding("class") className = "";

    constructor(private router: Router, public overLayContainer: OverlayContainer,
        theme: ThemeService) {
        this.changeTheme(theme.getTheme())
        theme.activateTheme.subscribe((theme) => {
            this.changeTheme(theme)
        })
    }

    ngOnInit(): void {
        this.router.navigate(["trips"])
    }

    changeTheme(theme: string | null): void {
        this.className = theme === "light" ? "light-mode" : "dark-mode"
        this.overLayContainer
            .getContainerElement()
            .classList.add(theme === "light" ? "light-mode" : "dark-mode")
        this.overLayContainer
            .getContainerElement()
            .classList.remove(theme !== "light" ? "light-mode" : "dark-mode")
    }
}
