import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Actor } from "../models/Actor"
import { environment } from "@env/environment"
import { BehaviorSubject, Subscription } from "rxjs"

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

@Injectable({
    providedIn: "root"
})
export class ActorsService {

    private loggedActor = new BehaviorSubject<Actor | null | undefined>(undefined);

    constructor(private client: HttpClient) {
        this.loginFromLocalStorage()
    }

    private async loginFromLocalStorage() {
        const idToken = localStorage.getItem("idToken")
        if (idToken === null) {
            this.loggedActor.next(null)
            return
        }

        try {
            const response = await this.client.get(`${environment.backendURL}/auth/id/${idToken}`).toPromise() as CheckAuthResponse
            this.loggedActor.next(response.actor)
        } catch {
            localStorage.removeItem("idToken")
            this.loggedActor.next(null)
        }
    }

    async registerActor(actor: Actor): Promise<void> {
        await this.client.post(`${environment.backendURL}/actors`, { actor }).toPromise()
    }

    subscribeToLoggedActor(fun: (actor: Actor | null | undefined) => void): Subscription {
        return this.loggedActor.subscribe(fun)
    }

    getLoggedActor(): Actor | null | undefined {
        return this.loggedActor.value
    }

    async login(email: string, password: string): Promise<void> {

        const loginResponse = await this.client.post(`${environment.backendURL}/auth/login`, { email, password }).toPromise() as LoginResponse
        const customToken = loginResponse.customToken

        const authResponse = await this.client.get(`${environment.backendURL}/auth/custom/${customToken}`).toPromise() as AuthResponse

        localStorage.setItem("idToken", authResponse.idToken)
        this.loggedActor.next(loginResponse.actor)
    }

    logout(): void {
        localStorage.removeItem("idToken")
        this.loggedActor.next(null)
    }

    async updateLoggedActor(actor: Actor): Promise<void> {
        actor._id = this.loggedActor.value?._id
        const idToken = localStorage.getItem("idToken")

        await this.client.put(`${environment.backendURL}/actors`, { actor }, {
            headers: { "Authorization": `Bearer ${idToken}` }
        }).toPromise()

        this.loggedActor.next(actor)
    }
}
