import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Trip } from "../models/Trip"

@Injectable({
    providedIn: "root"
})
export class TripsService {

    constructor(private client: HttpClient) { }

    async getTripsByManager(): Promise<Trip[]> {
        return await this.client.get(`${environment.backendURL}/trips/manager`).toPromise() as Trip[]
    }
}
