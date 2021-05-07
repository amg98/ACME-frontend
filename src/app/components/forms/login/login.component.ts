import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends TranslatableComponent {

    loginForm: FormGroup;

    constructor(translator: TranslatorService,
        private formBuilder: FormBuilder,
        private actorsService: ActorsService,
        private router: Router,
        private snackbar: MatSnackBar) {
        super(translator)

        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required]],
            password: ["", [Validators.required]],
        })
    }

    async onSubmit(): Promise<void> {
        if (!this.loginForm.valid) return

        try {
            await this.actorsService.login(this.loginForm.value.email, this.loginForm.value.password)
            
            this.snackbar.open(this.msg["login-success"], this.msg.close, {
                duration: 5000,
                panelClass: [ "alert-success" ]
            })
            this.router.navigate(["/"])
        } catch {
            this.loginForm.reset()
            this.snackbar.open(this.msg["login-failure"], this.msg.close, {
                duration: 5000,
                panelClass: [ "alert-error" ]
            })
        }
    }
}
