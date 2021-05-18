import { Component } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { FavouriteListsService } from "@services/favourite-lists.service"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"
import { FavouriteLists } from "src/app/models/FavouriteLists"
import { Trip } from "src/app/models/Trip"

@Component({
    selector: "app-favourite-lists",
    templateUrl: "./favourite-lists.component.html",
    styleUrls: ["./favourite-lists.component.scss"]
})
export class FavouriteListsComponent extends TranslatableComponent {

    favouriteLists!: FavouriteLists
    trips: Trip[][] = []
    loadingSync = false
    now = new Date()
    loadingLists = false

    constructor(translator: TranslatorService,
        private snackbar: MatSnackBar,
        private favouriteListsService: FavouriteListsService,
        private tripsService: TripsService) { 
        super(translator)
        this.getFavouriteLists()
    }

    async getFavouriteLists(): Promise<void> {
        this.loadingLists = true
        try {
            this.favouriteLists = {
                favouriteLists: [],
                timestamp: new Date().toISOString()
            }
            const favouriteLists = this.favouriteListsService.favouriteLists
            this.trips = await Promise.all(favouriteLists.favouriteLists.map(favList => this.tripsService.getTrips(favList.trips))) as Trip[][]
            this.favouriteLists = favouriteLists
        } catch {
            this.showAlert("favourite-lists/loading-error", "alert-error")
        }
        this.loadingLists = false
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    isExpired(trip: Trip): boolean {
        return Date.parse(trip.startDate) < Date.now()
    }

    isAboutToStart(trip: Trip): boolean {
        const WEEK = 7 * 24 * 3600 * 1000
        const interval = Date.parse(trip.startDate) - Date.now()
        return interval > 0 && interval < WEEK
    }

    async onSync(): Promise<void> {
        this.loadingSync = true
        try {
            await this.favouriteListsService.syncFavouriteLists()
            await this.getFavouriteLists()
            this.showAlert("favourite-lists/sync-success", "alert-success")
        } catch {
            this.showAlert("favourite-lists/sync-error", "alert-error")
        }
        this.loadingSync = false
    }
}
