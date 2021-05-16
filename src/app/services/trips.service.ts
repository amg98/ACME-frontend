import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Trip } from "../models/Trip";

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
    providedIn: "root"
})
export class TripService {

    constructor(private client: HttpClient) { }

    async getTrips(): Promise<Trip[]> {
        return await this.client.get(`${environment.backendURL}/trips`).toPromise() as Trip[];
    }

    async getTrip(_id: string): Promise<Trip> {
        return await this.client.get(`${environment.backendURL}/trips/${_id}/display`).toPromise() as Trip;
    }

    getManagerTrips(id: string) {
        const url = `${environment.backendURL}/trips/manager/${id}`;
        return this.client.get<Trip>(url).toPromise();
    }

    applyTrip(idTrip: string, idExplorer: string) {
        const url = `${environment.backendURL}/applications`;
        // return this.http.get<Trip>(url).toPromise();

        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify({"explorer": idExplorer, "trip": idTrip});
        return this.client.post(url, body, httpOptions).toPromise();

    }

    async postTrip(trip: Trip) {

        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");

        const body = JSON.stringify(trip);

        return new Promise<any>((resolve, reject) => {
            this.client.post(`${environment.backendURL}/trips`, body, httpOptions).toPromise()
                .then(res => {
                    resolve(res);
                }, err => {console.error(err); reject(err); });
        });
    }

    async updateTrip(trip: Trip, id: string) {
        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");

        const body = JSON.stringify(trip);
        console.log(body);
        return new Promise<any>((resolve, reject) => {
            this.client.put(`${environment.backendURL}/trips/${id}`, body, httpOptions).toPromise()
                .then(res => {
                    resolve(res);
                }, err => {console.error(err); reject(err); });
        });
    }

    async deleteTrip(id: string) {
        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");

        this.client.delete(`${environment.backendURL}/trips/${id}`, httpOptions).toPromise();
    }

    async cancelTrip(cancelReason: string , id: string) {
        const url = `${environment.backendURL}/trips/${id}/cancel`;
        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");

        const body = JSON.stringify({ reasonCancel: cancelReason });
        console.log(body);
        return new Promise<any>((resolve, reject) => {
            this.client.put(url, body, httpOptions).toPromise()
                .then(res => {
                    resolve(res);
                }, err => {console.error(err); reject(err); });
        });
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
        };
        return this.client.get<Trip[]>(`${environment.backendURL}/trips/search`, {
            params: parameters, observe: "body",
        }).toPromise();
    }
}


  

