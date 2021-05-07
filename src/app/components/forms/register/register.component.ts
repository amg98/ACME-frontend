import { Component } from "@angular/core"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent extends TranslatableComponent {

    registerForm: FormGroup;

    constructor(translator: TranslatorService,
                private formBuilder: FormBuilder,
                private actorsService: ActorsService,
                private router: Router,
                private snackbar: MatSnackBar) {
        super(translator)

        this.registerForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            surname: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(5)]],
            repeatPassword: ["", [Validators.required, Validators.minLength(5)]],
            phoneNumber: ["", [Validators.pattern(/^[0-9]+$/)]],
            address: ["", []],
            isSponsor: [false, []],
        }, { validators: this.checkPasswords })
    }

    checkPasswords(group: FormGroup): Record<string, boolean> | null {
        const password = group.get("password")?.value
        const confirmPassword = group.get("repeatPassword")?.value

        return password === confirmPassword ? null : { passwordsDontMatch: true }
    }

    async onSubmit(): Promise<void> {
        if (!this.registerForm.valid) return

        const actor = this.registerForm.value

        try {
            await this.actorsService.registerActor({
                name: actor.name,
                surname: actor.surname,
                email: actor.email,
                password: actor.password,
                phoneNumber: actor.phoneNumber,
                address: actor.address,
                roles: actor.isSponsor ? ["EXPLORER", "SPONSOR"] : ["EXPLORER"],
            })

            this.snackbar.open(this.msg["registration-success"], this.msg.close, {
                duration: 5000,
                panelClass: [ "alert-success" ]
            })
            this.router.navigate(["/"])
        } catch {
            this.snackbar.open(this.msg["registration-failure"], this.msg.close, {
                duration: 5000,
                panelClass: [ "alert-error" ]
            })
        }
    }
}
