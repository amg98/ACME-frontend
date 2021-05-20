import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ActivatedRoute, Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { SponsorshipsService } from "@services/sponsorships.service"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-sponsorship",
    templateUrl: "./sponsorship.component.html",
    styleUrls: ["./sponsorship.component.scss"]
})
export class SponsorshipComponent extends TranslatableComponent {

    isEditing = false
    tripID = ""
    sponsorshipID = ""
    sponsorshipForm!: FormGroup;
    loading = false

    constructor(translator: TranslatorService,
        private sponsorshipsService: SponsorshipsService,
        private formBuilder: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        route: ActivatedRoute) {
        super(translator)

        route.queryParams.subscribe(params => {
            if(params["landingPageURL"] && params["bannerURL"] && params["sponsorshipID"]) this.isEditing = true
            this.tripID = params["tripID"]
            this.sponsorshipID = params["sponsorshipID"]
            this.sponsorshipForm = this.formBuilder.group({
                landingPageURL: [params["landingPageURL"] || "", [Validators.required, Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)]],
                bannerURL: [params["bannerURL"] || "", [Validators.required, Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)]],
            })
        })
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    async onSubmit(): Promise<void> {
        if (!this.sponsorshipForm.valid) return
        this.loading = true

        const sponsorship = this.sponsorshipForm.value

        if(this.isEditing) {
            try {
                await this.sponsorshipsService.updateSponsorship({
                    _id: this.sponsorshipID,
                    bannerURL: sponsorship.bannerURL,
                    landingPageURL: sponsorship.landingPageURL,
                    isPaid: false,
                    tripID: this.tripID
                })
    
                this.showAlert("sponsorships/edit-success", "alert-success")
                this.router.navigate(["/sponsor/sponsorships"])
            } catch {
                this.showAlert("sponsorships/edit-error", "alert-error")
            }
        } else {
            try {
                await this.sponsorshipsService.createSponsorship({
                    bannerURL: sponsorship.bannerURL,
                    landingPageURL: sponsorship.landingPageURL,
                    isPaid: false,
                    tripID: this.tripID
                })
    
                this.showAlert("sponsorships/create-success", "alert-success")
                this.router.navigate(["/"])
            } catch {
                this.showAlert("sponsorships/create-error", "alert-error")
            }
        }

        this.loading = false
    }
}
