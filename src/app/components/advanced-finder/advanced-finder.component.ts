import { Component, Inject, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"


export interface AdvancedFinderDialogData {
    minPrice: Number,
    maxPrice: Number,
    minDate: Date,
    maxDate: Date
}

@Component({
    selector: "app-advanced-finder",
    templateUrl: "./advanced-finder.component.html",
    styleUrls: ["./advanced-finder.component.scss"]
})

export class AdvancedfinderComponent extends TranslatableComponent implements OnInit{

    minPrice!: Number;
    maxPrice!: Number;
    minDate!: Date;
    maxDate!: Date;

    filters!: AdvancedFinderDialogData

    constructor(
        translator: TranslatorService,
        public dialogRef: MatDialogRef<AdvancedFinderDialogData>,
        @Inject(MAT_DIALOG_DATA) public data: AdvancedFinderDialogData) {
        super(translator)
        
    }

    async ngOnInit() {
    
        this.filters = {
            "minPrice": this.minPrice,
            "maxPrice": this.maxPrice,
            "minDate": this.minDate,
            "maxDate": this.maxDate
        }
    }
    

    onNoClick(): void {
        this.dialogRef.close()
    }

}
