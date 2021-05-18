import { Component, OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { RejectApplicationComponent } from "@components/dialog/reject-application/reject-application.component"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ApplicationsService, GetManagerApplicationsData } from "@services/applications.service"
import { TranslatorService } from "@services/translator.service"
import { ApplicationStatus } from "src/app/models/Application"

@Component({
    selector: "app-applications",
    templateUrl: "./applications.component.html",
    styleUrls: ["./applications.component.scss"]
})
export class ManagerApplicationsComponent extends TranslatableComponent implements OnInit {
    data: GetManagerApplicationsData | null = null
    loading: boolean[][] = []

    constructor(private appsService: ApplicationsService,
        translator: TranslatorService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog) {
        super(translator)
    }

    async ngOnInit(): Promise<void> {
        try {
            this.data = await this.appsService.getManagerApplications()
            this.loading = this.data.apps.map(trip => trip.map(() => false))
        } catch {
            this.showAlert("applications/error", "alert-error")
            this.data = {
                trips: [],
                apps: [],
                explorers: []
            }
        }
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    async onDue(tripIndex: number, appIndex: number): Promise<void> {
        if (!this.data) return

        this.loading[tripIndex][appIndex] = true
        try {
            await this.appsService.updateApplicationByManager(this.data.apps[tripIndex][appIndex], ApplicationStatus.Due)
            this.data.apps[tripIndex][appIndex].status = ApplicationStatus.Due
        } catch {
            this.showAlert("applications/error-change-status", "alert-error")
        }
        this.loading[tripIndex][appIndex] = false
    }

    async onRejected(tripIndex: number, appIndex: number): Promise<void> {
        if (!this.data) return

        const dialogRef = this.dialog.open(RejectApplicationComponent, {
            width: "30em",
            data: { rejectedReason: "" }
        })

        dialogRef.afterClosed().subscribe(result => {
            if(result === undefined) return
            if(result === "") {
                this.showAlert("applications/no-reason", "alert-info")
                return
            }
            this.rejectApplication(tripIndex, appIndex, result)
        })
    }

    async rejectApplication(tripIndex: number, appIndex: number, rejectedReason: string): Promise<void> {
        if (!this.data) return

        this.loading[tripIndex][appIndex] = true
        try {
            await this.appsService.updateApplicationByManager(this.data.apps[tripIndex][appIndex], ApplicationStatus.Rejected, rejectedReason)
            this.data.apps[tripIndex][appIndex].status = ApplicationStatus.Rejected
            this.data.apps[tripIndex][appIndex].rejectReason = rejectedReason
        } catch {
            this.showAlert("applications/error-change-status", "alert-error")
        }
        this.loading[tripIndex][appIndex] = false
    }
}
