import { Entity } from "./Entity"

export interface Actor extends Entity {
    name: string,
    surname: string,
    email: string,
    password?: string,
    address?: string,
    phoneNumber?: string,
    roles: string[],
    isBanned?: boolean
}
