import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Sponsorship } from '../models/Sponsorship';

@Injectable({
  providedIn: 'root'
})
export class SponsorshipService {

  constructor(private client: HttpClient) { }

  async getListSponsorshipsOfSponsor(): Promise <Sponsorship[]> {
    return await this.client.get(`${environment.backendURL}/sponsorships`).toPromise() as Sponsorship[];
  }

  async getSponsorshipById(id: string): Promise <Sponsorship> {
    return await this.client.get(`${environment.backendURL}/sponsorships/${id}`).toPromise() as Sponsorship;
  }

  async getSponsorshipsTrips(id: string): Promise <Sponsorship[]> {
     return await this.client.get(`${environment.backendURL}/sponsorships/trips/${id}`).toPromise() as Sponsorship[];
  }

  async getRandomSponsorForATrip(id: string): Promise <Sponsorship[]> {
    return await this.client.get(`${environment.backendURL}/trips/${id}/random-sponsorship`).toPromise() as Sponsorship[];
 }

}