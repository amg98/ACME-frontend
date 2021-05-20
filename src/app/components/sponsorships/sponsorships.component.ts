import { Component, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { environment } from "@env/environment"
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
    loadingPay: boolean[] = []

    constructor(translator: TranslatorService,
        private sponsorshipsService: SponsorshipsService,
        private tripsService: TripsService,
        private router: Router,
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

    ngOnInit(): void {
        this.loadSponsorships()
    }

    async loadSponsorships(): Promise<void> {
        this.loading = true
        try {
            this.sponsorships = await this.sponsorshipsService.getSponsorships()
            this.trips = await this.tripsService.getTrips(this.sponsorships.map(it => it.tripID))
            this.loadingPay = new Array(this.sponsorships.length).fill(false)
        } catch {
            this.showAlert("sponsorships/load-error", "alert-error")
        }
        this.loading = false
    }

    async pay(index: number): Promise<void> {
        const id = this.sponsorships[index]._id
        if (!id) return
        this.loadingPay[index] = true
        try {
            const paypalURL = await this.sponsorshipsService.paySponsorship(id, `${environment.frontendURL}/sponsorship-payment`, `${environment.frontendURL}/sponsorship-payment`)
            window.location.href = paypalURL
        } catch {
            this.showAlert("sponsorships/payment-error", "alert-error")
        }
        this.loadingPay[index] = false
    }

    edit(sponsorship: Sponsorship): void {
        this.router.navigate(["/sponsorship-form"], {
            queryParams: {
                tripID: sponsorship.tripID,
                bannerURL: sponsorship.bannerURL,
                landingPageURL: sponsorship.landingPageURL,
                sponsorshipID: sponsorship._id
            }
        })
    }

    async remove(sponsorship: Sponsorship): Promise<void> {
        try {
            await this.sponsorshipsService.deleteSponsorship(sponsorship)
            this.showAlert("sponsorships/delete-success", "alert-success")
            await this.loadSponsorships()
        } catch {
            this.showAlert("sponsorships/delete-error", "alert-error")
        }
    }
}
