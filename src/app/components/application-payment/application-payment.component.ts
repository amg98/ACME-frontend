import { Component, OnDestroy } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { ApplicationsService } from "@services/applications.service"
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
    selector: "app-application-payment",
    templateUrl: "./application-payment.component.html",
    styleUrls: ["./application-payment.component.scss"]
})
export class ApplicationPaymentComponent extends TranslatableComponent implements OnDestroy {


  PaymentState = PaymentState
  loggedActorSub: Subscription
  state: PaymentState = PaymentState.LOGGING_IN

  constructor(translator: TranslatorService, actorsServices: ActorsService, appService: ApplicationsService, route: ActivatedRoute) {
      super(translator)
      this.loggedActorSub = actorsServices.subscribeToLoggedActor(actor => {
          if (actor === undefined) return
          if (actor === null) return

          route.queryParams.subscribe(async params => {
              console.log(params["PayerID"], params["paymentId"])
            
              if (!params["PayerID"] || !params["paymentId"]){
                  this.state = PaymentState.CANCELLED
                  return
              }

              try {
                  this.state = PaymentState.PAYING
                  await appService.confirmApplicationPaymen(params["PayerID"],params["paymentId"])
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
