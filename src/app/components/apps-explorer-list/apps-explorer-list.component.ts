import { Component, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ApplicationsService } from "@services/applications.service"
import { TranslatorService } from "@services/translator.service"
import { Application, ApplicationStatus } from "src/app/models/Application"

@Component({
    selector: "app-apps-explorer-list",
    templateUrl: "./apps-explorer-list.component.html",
    styleUrls: ["./apps-explorer-list.component.scss"],
})

export class AppsExplorerListComponent extends TranslatableComponent implements OnInit {

    due: Application[] = [];
    pending: Application[] = [];
    accepted: Application[] = [];
    rejected: Application[] = [];
    cancelled: Application[] = [];
    showSpiner = true

    constructor(translator: TranslatorService, private appServices: ApplicationsService,
        private snackbar: MatSnackBar) {
        super(translator)
    }

    async ngOnInit(): Promise<void> {
        try {
            await this.getApps()
            this.showAlert("applications/success", "alert-success")
        } catch (error) {
            this.showAlert("applications/error", "alert-error")
        }
    }

    async getApps(): Promise<void> {
        this.pending = await this.appServices.getApps(ApplicationStatus.Pending)
        this.due = await this.appServices.getApps(ApplicationStatus.Due)
        this.accepted = await this.appServices.getApps(ApplicationStatus.Accepted)
        this.rejected = await this.appServices.getApps(ApplicationStatus.Rejected)
        this.cancelled = await this.appServices.getApps(ApplicationStatus.Cancelled)
    }

    onPay(appId: Application): void {
        console.log(appId)
    }

    onCancel(appId: number): void {
        console.log(appId)
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
        this.showSpiner = false
    }
}
