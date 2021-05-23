import { HttpHeaders, HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { BehaviorSubject, Subscription } from "rxjs"
import { Trip } from "../models/Trip"

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
    providedIn: "root"
})
export class TripsService {

    private searchResults = new BehaviorSubject<Trip[] | null>(null);

    constructor(private client: HttpClient) { }

    async getTripsByManager(): Promise<Trip[]> {
        return await this.client.get(`${environment.backendURL}/trips/manager`).toPromise() as Trip[]
    }

    async getTrips(tripIDs: string[]): Promise<Trip[]> {
        const trips = await Promise.all(tripIDs.map(tripID => this.client.get(`${environment.backendURL}/trips/${tripID}/display`).toPromise()))
        return trips as Trip[]
    }

    async getAllTrips(): Promise<Trip[]> {
        return await this.client.get(`${environment.backendURL}/trips`).toPromise() as Trip[]
    }

    async getTrip(_id: string): Promise<Trip> {
        return await this.client.get(`${environment.backendURL}/trips/${_id}/display`).toPromise() as Trip
    }

    subscribeToSearchResults(fun: (trips: Trip[] | null) => void): Subscription {
        return this.searchResults.subscribe(fun)
    }

    async anonymousSearch(keyword: string): Promise<void> {
        const results = await this.client.get(`${environment.backendURL}/trips/search/${keyword}`).toPromise() as Trip[]
        this.searchResults.next(results)
    }

    applyTrip(tripID: string, explorerID: string) {
        const url = `${environment.backendURL}/applications`

        const headers = new HttpHeaders()
        headers.append("Content-Type", "application/json")
        const body = JSON.stringify({"explorerID": explorerID, "tripID": tripID})
        return this.client.post(url, body, httpOptions).toPromise()

    }

    async postTrip(trip: Trip) {

        const headers = new HttpHeaders()
        headers.append("Content-Type", "application/json")

        const body = JSON.stringify(trip)
        return this.client.post(`${environment.backendURL}/trips`,body,httpOptions)
    }

    async updateTrip(trip: Trip, id: string) {
        const headers = new HttpHeaders()
        headers.append("Content-Type", "application/json")

        const body = JSON.stringify(trip)
        console.log(body)
        return new Promise<any>((resolve, reject) => {
            this.client.put(`${environment.backendURL}/trips/${id}`, body, httpOptions).toPromise()
                .then(res => {
                    resolve(res)
                }, err => {console.error(err); reject(err) })
        })
    }

    async deleteTrip(id: string) {
        const headers = new HttpHeaders()
        headers.append("Content-Type", "application/json")

        this.client.delete(`${environment.backendURL}/trips/${id}`, httpOptions).toPromise()
    }

    async cancelTripByManager(trip: Trip, cancelReason = ""): Promise<void> {
        await this.client.put(`${environment.backendURL}/trips/${trip._id}/cancel`, { 
            cancelReason: cancelReason
        }).toPromise()
    }
    

    async searchTrips(start: number, 
        psize: number, 
        keyword: string, 
        minPrice: string, 
        maxPrice: string, 
        minDate: string, 
        maxDate: string) {

        const parameters = {
            startFrom: "" + start,
            pageSize: "" + psize,
            keyword: keyword == null ? "" : keyword,
            minPrice: minPrice == null ? "" : minPrice,
            maxPrice: maxPrice == null ? "" : maxPrice,
            minDate: minDate == null ? "" : minDate,
            maxDate: maxDate == null ? "" : maxDate
        }
        return this.client.get<Trip[]>(`${environment.backendURL}/trips/search`, {
            params: parameters, observe: "body",
        }).toPromise() 
    }
}
