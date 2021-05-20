import { Entity } from "./Entity";
import {Picture} from "./Picture";

export interface Trip extends Entity {
    ticker: string,
    title: string,
    description: string,
    price: number,
    requeriments: string[],
    startDate: string,
    endDate: string,
    pictures: string[],
    picturesObject: Picture[],
    managerID: string;
    stages: [{
        _id: string,
        title: string,
        description: string,
        price: number,
    }];
    isPublished: boolean,
    isCancelled:boolean,
    cancelReason: string
}