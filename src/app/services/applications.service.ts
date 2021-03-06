import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Actor } from "../models/Actor"
import { Application, ApplicationStatus } from "../models/Application"
import { Trip } from "../models/Trip"
import { ActorsService } from "./actors.service"
import { TranslatorService } from "./translator.service"
import { TripsService } from "./trips.service"

export interface GetManagerApplicationsData {
    trips: Trip[],
    apps: Application[][],
    explorers: Actor[][]
}

@Injectable({
    providedIn: "root"
})
export class ApplicationsService {

    constructor(private client: HttpClient, private tripsService: TripsService,
        private actorsService: ActorsService, private translator: TranslatorService) {

    }

    async getAppsByStatus(appStatus: string): Promise<Application[]> {
        const id = this.actorsService.getLoggedActor()?._id
        const apps = await this.client.get(`${environment.backendURL}/applications/explorers/${id}?status=${appStatus}`).toPromise() as Application[]
        return apps
    }

    async getManagerApplications(): Promise<GetManagerApplicationsData> {
        const trips = await this.tripsService.getTripsByManager()
        const apps = await Promise.all(trips.map(trip => this.client.get(`${environment.backendURL}/applications/trips/${trip._id}`).toPromise())) as Application[][]
        const explorers = await Promise.all(apps.map(trip => Promise.all(trip.map(app => this.actorsService.getActorSummary(app.explorerID))))) as Actor[][]
        return { trips, apps, explorers }
    }

    async updateApplicationByManager(application: Application, status: ApplicationStatus, rejectReason = ""): Promise<void> {
        await this.client.put(`${environment.backendURL}/applications/${application._id}/update`, {
            status,
            rejectReason
        }).toPromise()
    }

    async cancelApplication(application: Application): Promise<void> {
        await this.client.put(`${environment.backendURL}/applications/${application._id}/cancel`, {}).toPromise()
    }

    async payApplication(id: string, successURL: string, cancelURL: string): Promise<string> {
        const reqURL = `${environment.backendURL}/applications/payment`

        const body = {
            paymentData:
                { id, successURL, cancelURL, lang: this.translator.getLanguage() == "Spanish" ? "es" : "eng" }
        }

        const paypalURL = await this.client.post(reqURL, body, { responseType: "text" }).toPromise() as string
        localStorage.setItem("application-payment", id)
        return paypalURL
    }

    async confirmApplicationPaymen(paymentID: string, payerID: string): Promise<void> {
        const id = localStorage.getItem("application-payment")
        const reqURL = `${environment.backendURL}/applications/payment-confirm`
        const body = {
            confirmData: {
                id, paymentID, payerID
            }
        }
        await this.client.post(reqURL, body).toPromise()
        localStorage.removeItem("application-payment")
    }

}
