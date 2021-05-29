import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Observable } from "rxjs"
import { Sponsorship } from "../models/Sponsorship"
import { TranslatorService } from "./translator.service"

@Injectable({
    providedIn: "root"
})
export class SponsorshipsService {

    constructor(private client: HttpClient,
        private translator: TranslatorService) { }

    async getSponsorships(): Promise<Sponsorship[]> {
        return await this.client.get(`${environment.backendURL}/sponsorships`).toPromise() as Sponsorship[]
    }

    async getRandomSponsorship(tripID: string): Promise<Observable<Sponsorship>> {
        return await this.client.get<Sponsorship>(`${environment.backendURL}/trips/${tripID}/random-sponsorship`);
    }

    async paySponsorship(id: string, successURL: string, cancelURL: string): Promise<string> {
        const paypalURL = await this.client.post(`${environment.backendURL}/sponsorships/payment`, {
            paymentData: {
                id,
                successURL,
                cancelURL,
                lang: this.translator.getLanguage() == "Spanish" ? "es" : "eng"
            }
        }, { responseType: "text" }).toPromise() as string
        localStorage.setItem("sponsorship-payment", id)
        return paypalURL
    }

    async confirmPayment(paymentID: string, payerID: string): Promise<void> {
        const id = localStorage.getItem("sponsorship-payment")
        await this.client.post(`${environment.backendURL}/sponsorships/payment-confirm`, {
            confirmData: {
                id,
                paymentID,
                payerID
            }
        }).toPromise()
        localStorage.removeItem("sponsorship-payment")
    }

    async createSponsorship(sponsorship: Sponsorship): Promise<void> {
        await this.client.post(`${environment.backendURL}/sponsorships`, { sponsorship }).toPromise()
    }

    async updateSponsorship(sponsorship: Sponsorship): Promise<void> {
        await this.client.put(`${environment.backendURL}/sponsorships/${sponsorship._id}`, { sponsorship }).toPromise()
    }

    async deleteSponsorship(sponsorship: Sponsorship): Promise<void> {
        await this.client.delete(`${environment.backendURL}/sponsorships/${sponsorship._id}`).toPromise()
    }
}
