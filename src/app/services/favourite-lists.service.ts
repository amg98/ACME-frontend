import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { FavouriteLists } from "../models/FavouriteLists"

@Injectable({
    providedIn: "root"
})
export class FavouriteListsService {

    favouriteLists: FavouriteLists = {
        timestamp: new Date().toISOString(),
        favouriteLists: []
    }

    constructor(private client: HttpClient) {
        this.loadFavouriteLists()
    }

    async syncFavouriteLists(): Promise<void> {
        const response = await this.client.post(`${environment.backendURL}/favourite-lists/sync`, { lists: this.favouriteLists }).toPromise()
        this.favouriteLists = response as FavouriteLists
        this.saveFavouriteLists()
    }

    saveFavouriteLists(): void {
        this.favouriteLists.timestamp = new Date().toISOString()
        localStorage.setItem("favourite-lists", JSON.stringify(this.favouriteLists))
    }

    loadFavouriteLists(): void {
        const lists = localStorage.getItem("favourite-lists")
        if(lists == null) return

        this.favouriteLists = JSON.parse(lists) as FavouriteLists
    }
}
