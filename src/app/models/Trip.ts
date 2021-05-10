import { Entity } from './Entity';

export interface Trip extends Entity {
    //TODO: Mirar campos obligatorios en back y si alguno de estos no estuviesen
    ticker: string,
    title: string,
    description: string,
    price: Number,
    requeriments: string[],
    startDate: Date,
    endDate: Date,
    pictures: string[],
    manager: string;
    stages: [{
        _id: string,
        title: string,
        description: string,
        price: number,
    }];
    isPublished: Boolean,
    reasonCancel: string
}