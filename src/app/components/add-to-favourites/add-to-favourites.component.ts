import { Component, Input, OnDestroy } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { FavouriteListsService } from "@services/favourite-lists.service"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

@Component({
    selector: "app-add-to-favourites",
    templateUrl: "./add-to-favourites.component.html",
    styleUrls: ["./add-to-favourites.component.scss"]
})
export class AddToFavouritesComponent extends TranslatableComponent implements OnDestroy {

    @Input() tripID = ""

    lists: string[]
    isExplorer = false
    loggedActorSubscription: Subscription
    
    constructor(translator: TranslatorService,
        private favouriteListsService: FavouriteListsService,
        private actorsService: ActorsService,
        private snackbar: MatSnackBar) {
        super(translator)

        this.lists = favouriteListsService.favouriteLists.favouriteLists.map(it => it.name)

        this.loggedActorSubscription = this.actorsService.subscribeToLoggedActor(loggedActor => {
            this.isExplorer = loggedActor !== undefined && loggedActor !== null && loggedActor.roles.includes("EXPLORER")
        })
    }

    ngOnDestroy(): void {
        this.loggedActorSubscription.unsubscribe()
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    addToList(index: number): void {
        if(this.tripID === "") return

        const trips = this.favouriteListsService.favouriteLists.favouriteLists[index].trips
        if(trips.find(it => it == this.tripID)) {
            this.showAlert("favourite-lists/already-exists", "alert-info")
            return
        }
        
        trips.push(this.tripID)
        this.favouriteListsService.saveFavouriteLists()
        this.showAlert("favourite-lists/add-success", "alert-success")
    }
}
