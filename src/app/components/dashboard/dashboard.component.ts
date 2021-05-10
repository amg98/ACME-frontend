import { Component } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent extends TranslatableComponent { }
