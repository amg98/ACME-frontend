import { Component, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { AdvancedfinderComponent } from "@components/advanced-finder/advanced-finder.component"
import { ActorsService } from "@services/actors.service"
import { TripsService } from "@services/trips.service"
import { FinderService } from "@services/finder.service"
import { TranslatorService } from "@services/translator.service"
import { MatDialog } from "@angular/material/dialog"
import { Subscription } from "rxjs"
import { Trip } from "src/app/models/Trip"
import { Actor } from "src/app/models/Actor"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends TranslatableComponent implements OnDestroy {

    actor!: Actor;
    data!: Trip[];
    roles!: string[];

    keyword!: string;
    minPrice!: string;
    maxPrice!: string;
    minDate!: string;
    maxDate!: string;

    showfilter = true;
    finderId!: string;

    trips!: Trip[];

    loggedActorName: string | null;
    loggedActorSub: Subscription;
    isAdmin = false;
    isManager = false;
    isExplorer = false;
    isSponsor = false;

    constructor(translator: TranslatorService,
        private actorsService: ActorsService,
        private finderService: FinderService,
        private tripsService: TripsService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogRef: MatDialog,
        private snackBar: MatSnackBar) {
        super(translator)

        this.tripsService.subscribeToSearchResults(trips => {
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

    async ngOnInit(): Promise<void> {

        console.log(this.router.url)
        if (this.route.url !== undefined) {
            this.route.url.subscribe(url => {
                if (url[0].path !== "trips") {
                    this.router.navigate(["trips"])
                    this.route.queryParams
                        .subscribe(async params => {
                            if (this.actor != undefined) {
                                this.keyword = params["keyword"]
                                this.minDate = params["minDate"]
                                this.maxDate = params["maxDate"]
                                this.minPrice = params["minPrice"]
                                this.maxPrice = params["maxPrice"]
                                //await this.searchTrips()
                            }
                        })
                }
            })
        } else {
            console.log("test")
            //await this.searchTrips()
        }
    }
    advancedSearch(): void {
        const dialogRef = this.dialogRef.open(AdvancedfinderComponent, {
            width: "300em",
            // esto de aqui es opcional!!, no tiene que ver ni con la interfaz ni con 
            // los datos que retorna ni nada, si quieres lo puedes dejar en blanco
            data: {
                minPrice: "",
                maxPrice: "",
                startDate: "",
                endDate: ""
            }
        })

        dialogRef.afterClosed().subscribe(res => {
            console.log(res)
            if (res === undefined) return
            if (res.minPrice === undefined && res.maxPrice === undefined && res.minDate === undefined && res.maxDate === undefined) {
                this.showAlert("finder/no-filters", "alert-info")
                return
            }
            // this.cancelTrip(trip, index, res) aqui llama al metodo que crea el finder para obtener su id y continua el workflow que estabas haciendo
        })
    }

    saveFinder(): void {
        if (this.actor._id != null && this.actor._id !== undefined) {
            this.finderService.updateFinderUser({
                "keyword": this.keyword,
                "minPrice": this.minPrice,
                "maxPrice": this.maxPrice,
                "minDate": this.minDate,
                "maxDate": this.maxDate
            }, this.actor._id)
                .then((val) => {
                    console.log(val)
                    //this.messageService.notifyMessage(this.translateService.instant('messages.finder.saved'), 'alert alert-success');
                }, err => {
                    console.log(err)
                    //this.messageService.notifyMessage(this.translateService.instant('errorMessages.500'), 'alert alert-danger');
                })
        }
    }


    async searchTrips(): Promise<void> {
        this.finderService.searchTrips(0, 10, this.keyword, this.minPrice, this.maxPrice,
            this.minDate, this.maxDate)
            .then(async (val) => {
                this.finderId = val["_id"]
                // await this.finderService.getFinderUser(val["_id"])
            })
            .catch((err) => console.error(err.message))
    }
    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
    logout(): void {
        this.actorsService.logout()
        this.router.navigate(["trips"])
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.loggedActorSub.unsubscribe()
    }
}
