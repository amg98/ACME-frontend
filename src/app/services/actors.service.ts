import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actor } from "../models/Actor";
import { environment } from "@env/environment";

interface LoginResponse {
    customToken: string
    actor: Actor
}

interface AuthResponse {
    idToken: string
}

interface CheckAuthResponse {
    actor: Actor
}

@Injectable()
export class ActorsService {

    constructor(private client: HttpClient) { }

    private loggedActor: Actor | null = null;

    async registerActor(actor: Actor): Promise<void> {
        await this.client.post(`${environment.backendURL}/actors`, { actor }).toPromise();
    }

    async getLoggedActor(): Promise<Actor> {
        if(this.loggedActor !== null) return this.loggedActor;

        const idToken = localStorage.getItem("idToken");
        if(idToken === null) throw -1;

        const response = await this.client.get(`${environment.backendURL}/auth/id/${idToken}`).toPromise() as CheckAuthResponse;
        this.loggedActor = response.actor;
        return this.loggedActor;
    }

    async login(email: string, password: string): Promise<void> {

        const loginResponse = await this.client.post(`${environment.backendURL}/auth/login`, { email, password }).toPromise() as LoginResponse;
        const customToken = loginResponse.customToken;

        const authResponse = await this.client.get(`${environment.backendURL}/auth/custom/${customToken}`).toPromise() as AuthResponse;

        localStorage.setItem("idToken", authResponse.idToken);
        this.loggedActor = loginResponse.actor;
    }

    logout(): void {
        localStorage.removeItem("idToken");
        this.loggedActor = null;
    }
}
