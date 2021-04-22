import { Component } from "@angular/core";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
    providers: [ ActorsService ]
})
export class NavbarComponent extends TranslatableComponent {

    appName!: string;
    registerText!: string;
    loginText!: string;
    loggedActorName: string | null;
    logoutText!: string;

    constructor(translator: TranslatorService, private actorsService: ActorsService) {
        super(translator);
        
        this.setLanguageChangeListener(() => {
            this.appName = translator.getString("app-title");
            this.registerText = translator.getString("register");
            this.loginText = translator.getString("login");
            this.logoutText = translator.getString("logout");
        });

        this.loggedActorName = "";
        this.fetchLoggedActorName();
    }

    async fetchLoggedActorName(): Promise<void> {
        try {
            const actor = await this.actorsService.getLoggedActor();
            this.loggedActorName = `${actor.name} ${actor.surname}`;
        } catch {
            this.loggedActorName = null;
        }
    }

    logout(): void {
        this.actorsService.logout();
    }
}
