import { Component } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { DialogFlatRateComponent } from "@components/dialog/flat-rate/flat-rate.component"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { SystemParamsService } from "@services/system-params.service"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-flat-rate",
    templateUrl: "./flat-rate.component.html",
    styleUrls: ["./flat-rate.component.scss"]
})
export class FlatRateComponent extends TranslatableComponent {

    constructor(translator: TranslatorService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private paramsService: SystemParamsService) {
        super(translator)
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogFlatRateComponent, {
            width: "30em",
            data: {}
        })

        dialogRef.afterClosed().subscribe(async result => {
            if(result === undefined) return

            try {
                await this.paramsService.setSponsorshipsFlatRate(result)
                this.showAlert("flat-rate/success", "alert-success")
            } catch {
                this.showAlert("flat-rate/error", "alert-error")
            }
        })
    }
}
