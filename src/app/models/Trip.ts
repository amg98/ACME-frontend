import { Entity } from "./Entity"

export interface TripStage extends Entity {
    title: string,
    description: string,
    price: number,
}

export interface Trip extends Entity {
    ticker: string,
    title: string,
    description?: string,
    requirements: [string],
    startDate: string,
    endDate: string,
    pictures: string,
    cancelReason: string,
    isCancelled: boolean
    isPublished: boolean,   // should be always true
    price: number,
    stages: [TripStage],
}
