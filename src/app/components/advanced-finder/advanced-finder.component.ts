import { Component, Inject } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

export interface AdvancedFinderDialogData {
    minPrice: number,
    maxPrice: number,
    minDate: Date,
    maxDate: Date
}

@Component({
    selector: "app-advanced-finder",
    templateUrl: "./advanced-finder.component.html",
    styleUrls: ["./advanced-finder.component.scss"]
})

export class AdvancedfinderComponent extends TranslatableComponent {

    minPrice!: number;
    maxPrice!: number;
    minDate!: Date;
    maxDate!: Date;

    filters: AdvancedFinderDialogData = {
        "minPrice": this.minPrice,
        "maxPrice": this.maxPrice,
        "minDate": this.minDate,
        "maxDate": this.maxDate
    }

    constructor(
        translator: TranslatorService,
        public dialogRef: MatDialogRef<AdvancedFinderDialogData>,
        @Inject(MAT_DIALOG_DATA) public data: AdvancedFinderDialogData) {
        super(translator)
        this.filters.minPrice = data.minPrice
        this.filters.maxPrice = data.maxPrice
        this.filters.minDate = data.minDate
        this.filters.maxDate = data.maxDate
    } 

    onNoClick(): void {
        this.dialogRef.close()
    }

}
