import { Component, OnDestroy } from "@angular/core"
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

    appName!: string;
    registerText!: string;
    loginText!: string;
    loggedActorName: string | null;
    logoutText!: string;
    loggedActorSub: Subscription;
    editProfileText!: string;
    statsText!: string;
    isAdmin = false;

    constructor(translator: TranslatorService, private actorsService: ActorsService) {
        super(translator)
        
        this.setLanguageChangeListener(() => {
            this.appName = translator.getString("app-title")
            this.registerText = translator.getString("register")
            this.loginText = translator.getString("login")
            this.logoutText = translator.getString("logout")
            this.editProfileText = translator.getString("edit-profile")
            this.statsText = translator.getString("stats")
        })

        this.loggedActorName = ""
        this.loggedActorSub = actorsService.subscribeToLoggedActor(loggedActor => {
            this.isAdmin = false
            if(typeof loggedActor == "undefined") this.loggedActorName = ""
            else {
                this.loggedActorName = loggedActor === null ? null : `${loggedActor.name} ${loggedActor.surname}`
                this.isAdmin = loggedActor === null ? false : loggedActor.roles.includes("ADMINISTRATOR")
            }
        })
    }

    logout(): void {
        this.actorsService.logout()
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.loggedActorSub.unsubscribe()     
    }
}
