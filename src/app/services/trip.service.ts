import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from "@env/environment";
import { Trip } from '../models/Trip';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private client: HttpClient) { }

async getTrips() {
    const url = `${environment.backendURL}}/v1/trips/`;
    return this.client.get<Trip>(url).toPromise();
  }

async getTrip(_id: string) {
  const url = `${environment.backendURL}}/v1/trips/${_id}`;
  return this.client.get<Trip>(url).toPromise();
}

getManagerTrips(id: string) {
  const url = `${environment.backendURL}/v1/trips/manager/${id}`;
  return this.client.get<Trip>(url).toPromise();
}

applyTrip(idTrip: string, idExplorer: any) {
  const url = `${environment.backendURL}/v1/applications`;
  // return this.http.get<Trip>(url).toPromise();

  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  const body = JSON.stringify({'explorer': idExplorer, 'trip': idTrip});
  return this.client.post(url, body, httpOptions).toPromise();

}

async postTrip(trip: Trip) {
  const url = `${environment.backendURL}/v1/trips`;
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify(trip);

  return new Promise<any>((resolve, reject) => {
    this.client.post(url, body, httpOptions).toPromise()
      .then(res => {
        resolve(res);
      }, err => {console.error(err); reject(err); });
  });
}

async updateTrip(trip: Trip, id: string) {
  const url = `${environment.backendURL}/v1/trips/${id}`;
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify(trip);
  console.log(body);
  return new Promise<any>((resolve, reject) => {
    this.client.put(url, body, httpOptions).toPromise()
      .then(res => {
        resolve(res);
      }, err => {console.error(err); reject(err); });
  });
}

async deleteTrip(id: string) {
  const url = `${environment.backendURL}/v1/trips/${id}`;
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');

  this.client.delete(url, httpOptions).toPromise();
}

async cancelTrip(cancelReason: string , id: string) {
  const url = `${environment.backendURL}/v1/trips/${id}/cancel`;
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');

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
  const url = `${environment.backendURL}/v1/trips/search`;
  const parameters = {
    startFrom: '' + start,
    pageSize: '' + psize,
    keyword: keyword == null ? '' : keyword,
    minPrice: minPrice == null ? '' : minPrice,
    maxPrice: maxPrice == null ? '' : maxPrice,
    minDate: minDate == null ? '' : minDate,
    maxDate: maxDate == null ? '' : maxDate
  };

  /*if (maxDate == null) {
    delete parameters.maxDate;
  }

  if (minDate == null) {
    delete parameters.minDate;
  }

  if (maxPrice == null) {
    delete parameters.maxPrice;
  }

  if (minPrice == null) {
    delete parameters.minPrice;
  }

  if (keyword == null) {
    delete parameters.keyword;
  }*/

  return this.client.get<Trip[]>(url, {
    params: parameters, observe: 'body',
  }).toPromise();
}
}
