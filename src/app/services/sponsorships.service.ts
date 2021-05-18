import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Sponsorship } from "../models/Sponsorship"

@Injectable({
    providedIn: "root"
})
export class SponsorshipsService {

    constructor(private client: HttpClient) { }

    async getSponsorships(): Promise<Sponsorship[]> {
        return await this.client.get(`${environment.backendURL}/sponsorships`).toPromise() as Sponsorship[]
    }
}
