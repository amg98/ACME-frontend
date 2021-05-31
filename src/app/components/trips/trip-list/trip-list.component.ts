import { Component, OnInit } from "@angular/core"
import { TripsService } from "@services/trips.service"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { Router, ActivatedRoute } from "@angular/router"
import { TranslatorService } from "@services/translator.service"
import { Actor } from "src/app/models/Actor"
import { ActorsService } from "@services/actors.service"
import { FinderService } from "src/app/services/finder.service"
import { Trip } from "src/app/models/Trip"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Subscription } from "rxjs"

const MAX_TRIPS = 10

@Component({
    selector: "app-trip-list",
    templateUrl: "./trip-list.component.html",
    styleUrls: ["./trip-list.component.scss"]
})
export class TripListComponent extends TranslatableComponent implements OnInit {

    loggedActorName: string | null;
    loggedActorSub: Subscription;
    isAdmin = false;
    isManager = false;
    isExplorer = false;
    isSponsor = false;
    numObjects = MAX_TRIPS;
    tripNumber!: number;


    actor!: Actor;
    data!: Trip[];
    dataFiltered: Trip[] = [];
    roles!: string[];

    keyword!: string;
    minPrice!: number;
    maxPrice!: number;
    minDate!: Date;
    maxDate!: Date;

    showfilter = true;

    direction!: string;

    constructor(private tripService: TripsService,
        public actorsService: ActorsService,
        private finderService: FinderService,
        translator: TranslatorService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar) {
        super(translator)
        //route.queryParams.subscribe(val => this.ngOnInit())

        this.tripService.subscribeToSearchResults(trips => {
            if (trips == null) return
            this.data = trips
        })

        this.loggedActorName = ""
        this.loggedActorSub = actorsService.subscribeToLoggedActor(loggedActor => {
            if (typeof loggedActor == "undefined") this.loggedActorName = ""
            else if (loggedActor == null) {
                this.loggedActorName = null
            } else {
                this.loggedActorName = `${loggedActor.name} ${loggedActor.surname}`
                this.isAdmin = loggedActor.roles.includes("ADMINISTRATOR")
                this.isManager = loggedActor.roles.includes("MANAGER")
                this.isExplorer = loggedActor.roles.includes("EXPLORER")
                this.isSponsor = loggedActor.roles.includes("SPONSOR")
            }
        })
    }

    async ngOnInit() {
        console.log(this.route.url)
        if (this.route.url !== undefined) {

            this.data = await this.tripService.getAllTrips()
            console.log(this.data);
            this.data.forEach(trip => {
                if (this.checkDate(trip.startDate)) {
                    this.dataFiltered.push(trip)
                }
            });
        }
    }

    getFirstPicture(trip: Trip) {
        if (trip.pictures.length > 0) {
            if (trip.pictures[0] === "") {
                return "https://i.ya-webdesign.com/images/image-not-available-png-3.png"
            } else {
                return trip.pictures[0]
            }
        } else {
            return "https://i.ya-webdesign.com/images/image-not-available-png-3.png"
        }
    }

    checkManagerId(managerID: string) {
        if (managerID == this.actorsService.getLoggedActor()?._id) {
            return true
        } else {
            return false
        }
    }
    isOneWeekBeforeToStart(startDate: string) {

        const q = new Date()
        const m = q.getMonth() + 1
        const d = q.getDay()
        const y = q.getFullYear()

        const date = new Date(y, m, d)
        const tripStartDate = new Date(startDate)
        tripStartDate.setDate(tripStartDate.getDate() + 7)
        if (tripStartDate < date) {
            return true
        }
        return false
    }

    checkDate(date: string): boolean {
        const now = new Date()
        return ((new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) > 7)
    }

    displayTrip(trip: Trip) {
        return trip.isPublished && this.checkDate(trip.startDate)
    }

    // Functions to infinite scroll

    onScrollDown() {
        if (this.showfilter) {
            const start = this.numObjects
            this.numObjects += MAX_TRIPS
            this.appendTrips(start, this.numObjects)
            this.direction = "down"
        }
    }

    onScrollUp() {
        if (this.showfilter) {
            const start = this.numObjects
            this.numObjects += MAX_TRIPS
            this.prependTrips(start, this.numObjects)
            this.direction = "up"
        }
    }

    appendTrips(startIndex: number, endIndex: number) {
        this.addTrips(startIndex, endIndex, "push")
    }

    prependTrips(startIndex: number, endIndex: number) {
        this.addTrips(startIndex, endIndex, "unshift")
    }

    addTrips(startIndex: number, endIndex: number, _method: string) {
        this.finderService.searchTrips(startIndex, MAX_TRIPS, this.keyword, this.minPrice, this.maxPrice,
            this.minDate, this.maxDate)
            .then((val) => {
                this.data = this.data.concat(val)
            })
            .catch((err) => console.error(err.message))
    }

    showReasonCancel(cancelReason: string) {
        console.log(cancelReason)
        this.snackBar.open(cancelReason, this.msg.close, {
            duration: 5000,
            panelClass: ["alert-info"]
        })
    }

    newTrip() {
        this.router.navigate(["trips/new"])
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

}