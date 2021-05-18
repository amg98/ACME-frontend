import { Component, Inject } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

export interface RejectApplicationDialogData {
    rejectedReason: string
}

@Component({
    selector: "app-reject-application",
    templateUrl: "./reject-application.component.html",
    styleUrls: ["./reject-application.component.scss"]
})
export class RejectApplicationComponent extends TranslatableComponent {

    rejectedReason = ""
    
    constructor(public dialogRef: MatDialogRef<RejectApplicationComponent>,
        translator: TranslatorService,
        @Inject(MAT_DIALOG_DATA) public data: RejectApplicationDialogData) {
        super(translator)
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
