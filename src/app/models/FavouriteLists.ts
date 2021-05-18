import { Entity } from "./Entity"

export interface FavouriteList extends Entity {
    name: string,
    trips: string[]
}

export interface FavouriteLists extends Entity {
    timestamp: string,
    explorerID?: string,
    favouriteLists: FavouriteList[]
}
