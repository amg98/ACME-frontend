import { Component, Inject } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

export interface EditFavouriteListDialogData {
    listTitle: string
}

@Component({
    selector: "app-edit-favourite-list",
    templateUrl: "./edit-favourite-list.component.html",
    styleUrls: ["./edit-favourite-list.component.scss"]
})
export class EditFavouriteListComponent extends TranslatableComponent {

    listTitle = ""
    
    constructor(public dialogRef: MatDialogRef<EditFavouriteListComponent>,
        translator: TranslatorService,
        @Inject(MAT_DIALOG_DATA) data: EditFavouriteListDialogData) {
        super(translator)
        this.listTitle = data.listTitle
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
