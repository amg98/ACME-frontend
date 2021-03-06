import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"

export interface Stats {
    min: number,
    max: number,
    avg: number,
    stdv: number
}

interface ApplicationsRatio {
    pending: number,
    accepted: number,
    rejected: number,
    due: number,
    cancelled: number
}

interface AveragePriceFinder {
    minPrice: number,
    maxPrice: number
}

interface TopKeyword {
    keyword: string,
    count: number
}

@Injectable({
    providedIn: "root"
})
export class StatsService {

    constructor(private client: HttpClient) { }

    async getTripsPerManager(): Promise<Stats> {
        return await this.client.get(`${environment.backendURL}/stats/trips-per-manager`).toPromise() as Stats
    }

    async getApplicationsPerTrip(): Promise<Stats> {
        return await this.client.get(`${environment.backendURL}/stats/applications-per-trip`).toPromise() as Stats
    }

    async getPricePerTrips(): Promise<Stats> {
        return await this.client.get(`${environment.backendURL}/stats/price-per-trips`).toPromise() as Stats
    }

    async getApplicationsRatio(): Promise<ApplicationsRatio> {
        return await this.client.get(`${environment.backendURL}/stats/applications-ratio`).toPromise() as ApplicationsRatio
    }

    async getAveragePriceFinder(): Promise<AveragePriceFinder> {
        return await this.client.get(`${environment.backendURL}/stats/avg-price-finder`).toPromise() as AveragePriceFinder
    }

    async getTopKeywords(): Promise<TopKeyword[]> {
        return await this.client.get(`${environment.backendURL}/stats/top-keywords`).toPromise() as TopKeyword[]
    }
}
