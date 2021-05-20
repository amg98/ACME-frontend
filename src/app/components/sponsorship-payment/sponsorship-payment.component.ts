import { Component, OnDestroy } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { SponsorshipsService } from "@services/sponsorships.service"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

export enum PaymentState {
    LOGGING_IN,
    PAYING,
    CANCELLED,
    DONE,
    ERROR
}

@Component({
    selector: "app-sponsorship-payment",
    templateUrl: "./sponsorship-payment.component.html",
    styleUrls: ["./sponsorship-payment.component.scss"]
})
export class SponsorshipPaymentComponent extends TranslatableComponent implements OnDestroy {

    PaymentState = PaymentState
    loggedActorSub: Subscription
    state: PaymentState = PaymentState.LOGGING_IN

    constructor(actorsService: ActorsService,
        translator: TranslatorService,
        sponsorshipsService: SponsorshipsService,
        route: ActivatedRoute) {
        super(translator)

        this.loggedActorSub = actorsService.subscribeToLoggedActor(actor => {
            if(actor === undefined) return
            if(actor === null) return
            route.queryParams.subscribe(async params => {
                if(!params["PayerID"] || !params["paymentId"]) {
                    this.state = PaymentState.CANCELLED
                    return
                }

                try {
                    this.state = PaymentState.PAYING
                    await sponsorshipsService.confirmPayment(params["paymentId"], params["PayerID"])
                    this.state = PaymentState.DONE
                } catch {
                    this.state = PaymentState.ERROR
                }
            })
        })
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.loggedActorSub.unsubscribe()
    }
}
