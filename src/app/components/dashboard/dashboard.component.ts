import { Component } from "@angular/core"
import { StatsService } from "@services/stats.service"

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {

    constructor(private statsService: StatsService) {
        
    }

}
