import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
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
}
