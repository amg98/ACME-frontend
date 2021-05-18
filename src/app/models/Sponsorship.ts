import { Entity } from "./Entity"

export interface Sponsorship extends Entity {
    bannerURL: string,
    landingPageURL: string,
    tripID: string,
    isPaid: boolean
}
