import { Entity } from "./Entity"

export interface Finder extends Entity {
    keyword: string,
    minPrice:number,
    maxPrice:number,
    startDate: Date,
    endDate: Date,
    actorID: string,
    createdAt: Date, 
    trips?: [string]
}