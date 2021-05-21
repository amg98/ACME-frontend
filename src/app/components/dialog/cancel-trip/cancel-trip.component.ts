import { Component, Inject } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

export interface CancelTripDialogData {
  cancelReason: string
}

@Component({
    selector: "app-cancel-trip",
    templateUrl: "./cancel-trip.component.html",
    styleUrls: ["./cancel-trip.component.scss"]
})

export class CancelTripComponent extends TranslatableComponent {

  cancelReason = ""

  constructor(translator: TranslatorService,
    public dialogRef: MatDialogRef<CancelTripDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: CancelTripDialogData) {
      super(translator)
  }

  onNoClick(): void {
      this.dialogRef.close()
  }

}
