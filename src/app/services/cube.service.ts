import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "@env/environment"
import { Actor } from "../models/Actor"

enum CubeCondition {
    Equal = "=",
    NotEqual = "!=",
    Greater = ">",
    GreaterEqual = ">=",
    Less = "<",
    LessEqual = "<="
}

@Injectable({
    providedIn: "root"
})
export class CubeService {

    constructor(private client: HttpClient) { }
    
    async computeCube(): Promise<void> {
        await this.client.post(`${environment.backendURL}/cubes`, {}).toPromise()
    }

    async queryCube(actor: Actor, period: string): Promise<number> {
        try {
            return await this.client.get(`${environment.backendURL}/cubes/${actor._id}/period/${period}`).toPromise() as number
        } catch(e) {
            if(e.status === 404) return 0
            throw e
        }
    }

    async queryCubeComplex(period: string, condition: CubeCondition, amount: number): Promise<Actor[]> {
        const params = new HttpParams()
            .set("period", period)
            .set("condition", condition)
            .set("amount", amount.toString())
        return await this.client.get(`${environment.backendURL}/cubes/explorers`, { params }).toPromise() as Actor[]
    }
}
