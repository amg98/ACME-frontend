import { Component } from "@angular/core"
import { MatDialogRef } from "@angular/material/dialog"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-new-favourite-list",
    templateUrl: "./new-favourite-list.component.html",
    styleUrls: ["./new-favourite-list.component.scss"]
})
export class NewFavouriteListComponent extends TranslatableComponent {

    listTitle = ""
    
    constructor(public dialogRef: MatDialogRef<NewFavouriteListComponent>,
        translator: TranslatorService) {
        super(translator)
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
