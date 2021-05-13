import { Component } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"

@Component({
    selector: "app-finder",
    templateUrl: "./finder.component.html",
    styleUrls: ["./finder.component.scss"]
})
export class FinderComponent extends TranslatableComponent {

    keyword = ""

    constructor(translator: TranslatorService,
        private tripsService: TripsService,
        private snackbar: MatSnackBar) {
        super(translator)
    }

    search(): void {
        if(this.keyword === "") {
            this.snackbar.open(this.msg["no-keyword"], this.msg.close, {
                duration: 5000,
                panelClass: ["alert-info"]
            })
            return
        }
        this.tripsService.anonymousSearch(this.keyword)
    }
}
