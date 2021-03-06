import { Component, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { environment } from "@env/environment"
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

    loadingPay: boolean[] = []

    constructor(translator: TranslatorService, private appService: ApplicationsService,
        private snackbar: MatSnackBar) {
        super(translator)
    }

    async ngOnInit(): Promise<void> {
        try {
            await this.getApps()
            this.showAlert("applications/success", "alert-success")
            this.loadingPay = new Array(this.due.length).fill(false)
        } catch (error) {
            this.showAlert("applications/error", "alert-error")
        }
    }

    async getApps(): Promise<void> {
        this.due = await this.appService.getAppsByStatus(ApplicationStatus.Due)
        this.rejected = await this.appService.getAppsByStatus(ApplicationStatus.Rejected)
        this.accepted = await this.appService.getAppsByStatus(ApplicationStatus.Accepted)
        this.pending = await this.appService.getAppsByStatus(ApplicationStatus.Pending)
        this.cancelled = await this.appService.getAppsByStatus(ApplicationStatus.Cancelled)
    }

    async onPay(index: number): Promise<void> { 
        const id = this.due[index]._id
        if (!id) return
        this.loadingPay[index] = true
        try {
            const paypalURL =
                await this.appService.payApplication(id, `${environment.frontendURL}/application-payment`, `${environment.frontendURL}/application-payment`)
            window.location.href = paypalURL 
        } catch {
            this.showAlert("payment-error", "alert-error")
        }
        this.loadingPay[index] = false
    }

    async onCancel(app: Application): Promise<void> {
        try {
            const previousState = app.status
            app.status = ApplicationStatus.Cancelled
            await this.appService.cancelApplication(app).then(res => {

                console.log("cancel ", res)

            })

            this.showAlert("applications/success-cancel", "alert-success")
            await this.reload(previousState)
        } catch (error) {
            this.showAlert("applications/error-cancel", "alert-error")
        }

    }

    async reload(status: string): Promise<void> {
        console.log(status)
        if (status === ApplicationStatus.Accepted) {
            this.accepted = []
            this.accepted = await this.appService.getAppsByStatus(ApplicationStatus.Accepted)
        } else {
            this.pending = []
            this.pending = await this.appService.getAppsByStatus(ApplicationStatus.Pending)
        }
        this.cancelled = []
        this.cancelled = await this.appService.getAppsByStatus(ApplicationStatus.Cancelled)
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
        this.showSpiner = false
    }
}
