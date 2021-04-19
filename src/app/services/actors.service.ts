import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actor } from "../models/Actor";
import { environment } from "@env/environment";

@Injectable()
export class ActorsService {

    constructor(private client: HttpClient) { }

    async registerActor(actor: Actor): Promise<void> {
        await this.client.post(`${environment.backendURL}/actors`, { actor }).toPromise();
    }
}
