import { Entity } from "./Entity"

export enum ApplicationStatus {
    Pending = "PENDING",
    Rejected = "REJECTED",
    Due = "DUE",
    Accepted = "ACCEPTED",
    Cancelled = "CANCELLED",
}

export interface Application extends Entity {
    status: ApplicationStatus
    comments?: [string],
    tripID: string,
    explorerID: string,
    timeStamp: string,
    rejectReason?: string,
}
