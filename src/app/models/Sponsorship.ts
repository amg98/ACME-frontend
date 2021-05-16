import { Entity } from './Entity';

export interface Sponsorship extends Entity {
    banner: string;
    link: string;
    sponsor: string;
    tripSponsorships: [{
        trip: string;
        paid: boolean;
    }];
}