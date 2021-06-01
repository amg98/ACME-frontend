import { formatDate } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AdvancedfinderComponent } from "@components/advanced-finder/advanced-finder.component"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { FinderService } from "@services/finder.service"
import { TranslatorService } from "@services/translator.service"
import { Finder } from "src/app/models/Finder"

@Component({
    selector: "app-finder-config",
    templateUrl: "./finder-config.component.html",
    styleUrls: ["./finder-config.component.scss"],
})
export class FinderConfigComponent
    extends TranslatableComponent
    implements OnInit {
    configDuration!: number;
    showSpiner = false;
    finders!: Finder[];

    constructor(translator: TranslatorService, private dialogRef: MatDialog,
        private finderSrv: FinderService,
        private snackBar: MatSnackBar) {
        super(translator)
    }

    async ngOnInit(): Promise<void> {
        this.showSpiner = true
        this.finders = this.getFinders() //await this.finderSrv.getFindersByActor()
        console.log(this.finders)
        this.showSpiner = false
    }

    getFinders(): Finder[] {
        return [
            {
                _id: "60b58bd0e18ac9312cfe14e6",
                keyword: "word1",
                minPrice: 100,
                maxPrice: 200,
                startDate: new Date("2021-05-12T16:13:46.491Z"),
                endDate: new Date("2021-05-19T16:13:46.491Z"),
                actorID: "609f6a5c0cfa5e000fd75f70",
                createdAt: new Date("2021-05-12T16:13:46.491Z"),
            },
            {
                _id: "60b58bdee18ac9312cfe14e7",
                keyword: "word2",
                minPrice: 500,
                maxPrice: 600,
                startDate: new Date("2021-05-12T16:13:46.491Z"),
                endDate: new Date("2021-05-19T16:13:46.491Z"),
                actorID: "609f6a5c0cfa5e000fd75f70",
                createdAt: new Date("2021-05-12T16:13:46.491Z"),
            },
            {
                _id: "60b58beae18ac9312cfe14e8",
                keyword: "word1",
                minPrice: 200,
                maxPrice: 300,
                startDate: new Date("2021-05-12T16:13:46.491Z"),
                endDate: new Date("2021-05-19T16:13:46.491Z"),
                actorID: "609f6a5c0cfa5e000fd75f70",
                createdAt: new Date("2021-05-12T16:13:46.491Z"),
            },
        ]
    }

    onModify(finder: Finder, index: number): void {
        console.log(finder)
        const dialogRef = this.dialogRef.open(AdvancedfinderComponent, {
            width: "300em",
            data: {
                minPrice: finder.minPrice,
                maxPrice: finder.maxPrice,
                minDate: formatDate(finder.startDate, "yyyy-MM-dd", "en"),
                maxDate: formatDate(finder.endDate, "yyyy-MM-dd", "en")
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
            this.finders[index].minPrice = res.minPrice
            this.finders[index].maxPrice = res.maxPrice
            this.finders[index].startDate = res.minDate
            this.finders[index].endDate = res.maxDate
        })
    }

    onShowResults(finder: Finder): void {
        console.log(finder)
    }
    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
}
