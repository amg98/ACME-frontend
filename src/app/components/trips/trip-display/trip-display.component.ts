import { Component, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"
import { SponsorshipsService } from "@services/sponsorships.service"
import { Router, ActivatedRoute } from "@angular/router"
import { ActorsService } from "@services/actors.service"
import { Sponsorship } from "src/app/models/Sponsorship"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Trip } from "src/app/models/Trip"
import { Subscription } from "rxjs"

@Component({
    selector: "app-trip-display",
    templateUrl: "./trip-display.component.html",
    styleUrls: ["./trip-display.component.scss"]
})
export class TripDisplayComponent extends TranslatableComponent implements OnInit {

    loggedActorName: string | null;
    loggedActorSub: Subscription;
    isAdmin = false;
    isManager = false;
    isExplorer = false;
    isSponsor = false;

    trip!: Trip;
    id!: string;
    sponsorship!: Sponsorship;

    constructor(public actorsService: ActorsService,
        private tripService: TripsService,
        translator: TranslatorService,
        private sponsorshipsService: SponsorshipsService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar) {
        super(translator)


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
        // Recover id param
        this.id = this.route.snapshot.params["id"]
        // console.log('id trip: ' + this.id);
        const param = this.route.snapshot.params["paramKey"]
        // console.log('param: ' + param);

        this.trip = await this.tripService.getTrip(this.id)
        console.log(this.trip._id)

        if (this.trip._id) {
            await (await this.sponsorshipsService.getRandomSponsorship(this.trip._id)).subscribe(res=>{
                this.sponsorship
            })    
        }
    }


    goBack(): void {
        this.router.navigate(["/trips"])
    }

    getPicture(n: number) {
        if (this.trip.pictures.length > 0) {
            if (this.trip.pictures[n] === "") {
                return "https://i.ya-webdesign.com/images/image-not-available-png-3.png"
            } else {
                return this.trip.pictures[n]
            }
        } else {
            return "https://i.ya-webdesign.com/images/image-not-available-png-3.png"
        }
    }

    goSponsor(tripID: string) {
        this.router.navigate(["sponsorship-form"], { queryParams: { tripID: tripID } })
    }

    onDate(startDate: string) {
        const q = new Date()
        const m = q.getMonth() + 1
        const d = q.getDay()
        const y = q.getFullYear()

        const date = new Date(y, m, d)
        const startDateParsed = new Date(startDate)
        if (startDateParsed > date) {
            return true
        } else {
            return false
        }
    }

    async onApply(tripId: string) {
        // console.log('idTrip: ' + idTrip);
        try {
            const loggedActor = this.actorsService.getLoggedActor()

            if (loggedActor !== null
                && loggedActor !== undefined
                && loggedActor._id !== undefined) {
                // Se crea la aplicación
                this.tripService.applyTrip(String(tripId), loggedActor._id)
                    .then(() => {
                        // console.log('appli detail: ' + appli);
                        this.showAlert("applicationCreatedSuccessText", "alert-success")
                        document.body.scrollTop = 0 // For Safari
                        document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
                    })
                    .catch((err) => {
                        console.error(err)
                        this.showAlert("applicationCreatedFailureText", "alert-error")
                    })
            } else {
                console.log("Error recuperar actor logado!")
            }
            return true
        } catch {
            this.showAlert("applicationCreatedFailureText", "alert-error")
            return false
        }
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
}
