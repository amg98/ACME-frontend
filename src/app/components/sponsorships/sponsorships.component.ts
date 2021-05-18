import { Component, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { SponsorshipsService } from "@services/sponsorships.service"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"
import { Sponsorship } from "src/app/models/Sponsorship"
import { Trip } from "src/app/models/Trip"

@Component({
    selector: "app-sponsorships",
    templateUrl: "./sponsorships.component.html",
    styleUrls: ["./sponsorships.component.scss"]
})
export class SponsorshipsComponent extends TranslatableComponent implements OnInit {

    sponsorships: Sponsorship[]
    trips: Trip[]
    loading = false
    
    constructor(translator: TranslatorService,
        private sponsorshipsService: SponsorshipsService,
        private tripsService: TripsService,
        private snackbar: MatSnackBar) { 
        super(translator)
        this.sponsorships = []
        this.trips = []
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    async ngOnInit(): Promise<void> {
        this.loading = true
        try {
            this.sponsorships = await this.sponsorshipsService.getSponsorships()
            this.trips = await this.tripsService.getTrips(this.sponsorships.map(it => it.tripID))
        } catch {
            this.showAlert("sponsorships/load-error", "alert-error")
        }
        this.loading = false
    }
}
