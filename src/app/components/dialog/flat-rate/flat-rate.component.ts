import { Component } from "@angular/core"
import { MatDialogRef } from "@angular/material/dialog"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-dialog-flat-rate",
    templateUrl: "./flat-rate.component.html",
    styleUrls: ["./flat-rate.component.scss"]
})
export class DialogFlatRateComponent extends TranslatableComponent {

    flatRate = 0
    
    constructor(public dialogRef: MatDialogRef<DialogFlatRateComponent>,
        translator: TranslatorService) {
        super(translator)
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
