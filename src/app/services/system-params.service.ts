import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"

@Injectable({
    providedIn: "root"
})
export class SystemParamsService {

    constructor(private client: HttpClient) { }

    async setSponsorshipsFlatRate(rate: number): Promise<void> {
        await this.client.put(`${environment.backendURL}/system-params/flat-rate`, {}, {
            params: new HttpParams().set("value", rate.toString())
        }).toPromise()
    }
}
