import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Actor } from "../models/Actor"
import { Application, ApplicationStatus } from "../models/Application"
import { Trip } from "../models/Trip"
import { ActorsService } from "./actors.service"
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

    constructor(private client: HttpClient,
        private tripsService: TripsService,
        private actorsService: ActorsService) { }

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
}