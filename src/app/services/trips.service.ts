import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { BehaviorSubject, Subscription } from "rxjs"
import { Trip } from "../models/Trip"

@Injectable({
    providedIn: "root"
})
export class TripsService {

    private searchResults = new BehaviorSubject<Trip[] | null>(null);

    constructor(private client: HttpClient) { }

    async getTripsByManager(): Promise<Trip[]> {
        return await this.client.get(`${environment.backendURL}/trips/manager`).toPromise() as Trip[]
    }

    subscribeToSearchResults(fun: (trips: Trip[] | null) => void): Subscription {
        return this.searchResults.subscribe(fun)
    }

    async anonymousSearch(keyword: string): Promise<void> {
        const results = await this.client.get(`${environment.backendURL}/trips/search/${keyword}`).toPromise() as Trip[]
        this.searchResults.next(results)
    }
}
