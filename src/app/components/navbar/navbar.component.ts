import { Component, OnDestroy } from "@angular/core"
import { Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends TranslatableComponent implements OnDestroy {

    loggedActorName: string | null;
    loggedActorSub: Subscription;
    isAdmin = false;
    isManager = false;
    isExplorer = false;

    constructor(translator: TranslatorService, private actorsService: ActorsService, private router: Router) {
        super(translator)

        this.loggedActorName = ""
        this.loggedActorSub = actorsService.subscribeToLoggedActor(loggedActor => {
            if(typeof loggedActor == "undefined") this.loggedActorName = ""
            else {
                this.loggedActorName = loggedActor === null ? null : `${loggedActor.name} ${loggedActor.surname}`
                this.isAdmin = loggedActor === null ? false : loggedActor.roles.includes("ADMINISTRATOR")
                this.isManager = loggedActor === null ? false : loggedActor.roles.includes("MANAGER")
                this.isExplorer = loggedActor === null ? false : loggedActor.roles.includes("EXPLORER")
            }
        })
    }

    logout(): void {
        this.actorsService.logout()
        this.router.navigate(["/"])
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.loggedActorSub.unsubscribe()     
    }
}
