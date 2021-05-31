import { HttpHeaders, HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
}

@Injectable({
    providedIn: "root"
})
export class FinderService {

    constructor(private client: HttpClient) { }

    async getFinderUser(id: string) {
        return this.client.get(`${environment.backendURL}/finders/${id}`).toPromise()
    }

    async updateFinderUser(finder: any, id: string) {
        const headers = new HttpHeaders()
        headers.append("Content-Type", "application/json")

        const body = JSON.stringify(finder)
        console.log(body)

        this.client.put(`${environment.backendURL}/finders/${id}`, body, httpOptions).toPromise()

    }

    async searchTrips(start: number,
        psize: number,
        keyword: string,
        minPrice: string,
        maxPrice: string,
        minDate: string,
        maxDate: string): Promise<any> {

        const parameters = {
            startFrom: "" + start,
            pageSize: "" + psize,
            keyword: keyword == null ? "" : keyword,
            minPrice: minPrice == null ? "" : minPrice,
            maxPrice: maxPrice == null ? "" : maxPrice,
            minDate: minDate == null ? "" : minDate,
            maxDate: maxDate == null ? "" : maxDate
        }
        return this.client.post(`${environment.backendURL}/finders`, {
            params: parameters, observe: "body",
        }).toPromise()
    }
}