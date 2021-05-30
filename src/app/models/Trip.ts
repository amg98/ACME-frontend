import { Entity } from "./Entity"

export interface Trip extends Entity {
    ticker: string,
    title: string,
    description?: string,
    requirements: string[],
    startDate: string,
    endDate: string,
    pictures: string[],
    cancelReason: string,
    isCancelled: boolean,
    isPublished: boolean,
    price: number,
    stages: [{
        title: string,
        description: string,
        price: number,
    }]; 
    managerID: string 
}