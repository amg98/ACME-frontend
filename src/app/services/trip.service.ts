import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private client: HttpClient) { }

async getTrips() {
    const url = `${environment.backendURL}}/v1/trips/`;
    return this.client.get(url).toPromise();
  }

async getTrip(trip: string) {
  const url = `${environment.backendURL}}/v1/trips/${trip}`;
  return this.client.get(url).toPromise();
}

getManagerTrips(manager: string) {
  const url = `${environment.backendURL}/v1/trips/manager/${manager}`;
  return this.client.get(url).toPromise();
}

}
