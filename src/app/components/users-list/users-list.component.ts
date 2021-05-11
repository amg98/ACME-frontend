import { Component, OnInit } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { TranslatorService } from "@services/translator.service"
import { Actor } from "src/app/models/Actor"

@Component({
    selector: "app-users-list",
    templateUrl: "./users-list.component.html",
    styleUrls: ["./users-list.component.scss"]
})
export class UsersListComponent extends TranslatableComponent implements OnInit {

    users: Actor[]
    changingStatus: boolean[]
    loading = true

    constructor(private actorsService: ActorsService,
        translator: TranslatorService,
        private snackbar: MatSnackBar) {
        super(translator)
        this.users = []
        this.changingStatus = []
    }

    async ngOnInit(): Promise<void> {
        this.loading = true
        try {
            this.users = await this.actorsService.getActorsSummary()
            this.changingStatus = new Array(this.users.length).fill(false)
        } catch {
            this.snackbar.open(this.msg["users-list/load-error"], this.msg.close, {
                duration: 5000,
                panelClass: ["alert-error"]
            })
        }
        this.loading = false
    }

    async onBan(user: Actor, i: number): Promise<void> {
        this.changingStatus[i] = true
        try {
            await this.actorsService.setActorBanStatus(user, !user.isBanned)
            user.isBanned = !user.isBanned
        } catch {
            this.snackbar.open(this.msg["users-list/ban-error"], this.msg.close, {
                duration: 5000,
                panelClass: ["alert-error"]
            })
        }
        this.changingStatus[i] = false
    }
}
