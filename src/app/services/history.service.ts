import { Injectable } from "@angular/core"
import { HistoryTrips } from "@components/history/history.component"

@Injectable({
    providedIn: "root"
})
export class HistoryService {

    history: HistoryTrips[] = []
    saveHistory: HistoryTrips[] = []

    visitedTrip: HistoryTrips = {
        _id: "", title: "", visits: 0, description: "", frequency: 0, button: ""
    }

    // const history: HistoryTrips[] = []
    // {_id: "d", title: "1string", visits: 10, description: "string1", frequency: 0, button: ""}
    updateHistory(id: string, title: string, desc = ""): void {
        this.visitedTrip._id = id
        this.visitedTrip.title = title
        this.visitedTrip.description = desc
        this.visitedTrip.visits = 1
        this.visitedTrip.frequency = 0

        const localStorageHistory = localStorage.getItem("history")
        if (localStorageHistory == null) {
            this.saveHistory.push(this.visitedTrip)
            localStorage.setItem("history", JSON.stringify(this.saveHistory))
            return
        } else {
            this.saveHistory = JSON.parse(localStorageHistory)
        }

        let exist = false
        this.saveHistory.forEach(trip => {
            if (trip._id === id) {
                trip.visits = trip.visits + 1
                exist = true
            }
        })

        if (!exist) this.saveHistory.push(this.visitedTrip)
        localStorage.setItem("history", JSON.stringify(this.saveHistory))
    }
    //habia apagado el
    getHistory(): HistoryTrips[] {
        this.getHistoryFromLocalStorage()//se carga lo que este en el localStorage, que era la funcion que me daba error
        this.history = this.getFrecuencies(this.history, this.getVisitCount(this.history))
        return this.history
    }

    getHistoryFromLocalStorage(): void {// aqui era que tenia el error
        const localStorageHistory = localStorage.getItem("history")
        if (localStorageHistory == null) {
            return
        }
        this.history = JSON.parse(localStorageHistory)
        console.log(this.history)
    }

    getVisitCount(data: HistoryTrips[]): number {
        let count = 0
        data.forEach(trips => {
            count = count + trips.visits
        })
        return count
    }

    getFrecuencies(data: HistoryTrips[], total: number): HistoryTrips[] {
        data.forEach(trips => {
            trips.frequency = Math.round((trips.visits / total) * 100)
        })
        return data
    }
}
