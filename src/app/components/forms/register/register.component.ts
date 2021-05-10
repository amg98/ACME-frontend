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
    loading = false
    isAdmin: boolean

    constructor(translator: TranslatorService,
                private formBuilder: FormBuilder,
                private actorsService: ActorsService,
                private router: Router,
                private snackbar: MatSnackBar) {
        super(translator)

        const isAdmin = actorsService.getLoggedActor()?.roles.includes("ADMINISTRATOR")
        this.isAdmin = isAdmin ? true : false

        this.registerForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            surname: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(5)]],
            repeatPassword: ["", [Validators.required, Validators.minLength(5)]],
            phoneNumber: ["", [Validators.pattern(/^[0-9]+$/)]],
            address: ["", []],
            isManager: [{ value: isAdmin, disabled: true }, []],
            isExplorer: [true, []],
            isSponsor: [false, []],
        }, { validators: [this.checkPasswords, this.checkRoles] })
    }

    checkPasswords(group: FormGroup): Record<string, boolean> | null {
        const password = group.get("password")?.value
        const confirmPassword = group.get("repeatPassword")?.value

        return password === confirmPassword ? null : { passwordsDontMatch: true }
    }

    checkRoles(group: FormGroup): Record<string, boolean> | null {
        const isManager = group.get("isManager")?.value
        const isExplorer = group.get("isExplorer")?.value
        const isSponsor = group.get("isSponsor")?.value

        return isManager || isExplorer || isSponsor ? null : { oneRoleAtLeast: true }
    }

    async onSubmit(): Promise<void> {
        if (!this.registerForm.valid) return
        this.loading = true

        const actor = this.registerForm.value

        const roles = []
        if(this.isAdmin) roles.push("MANAGER")
        if(actor.isExplorer) roles.push("EXPLORER")
        if(actor.isSponsor) roles.push("SPONSOR")

        try {
            await this.actorsService.registerActor({
                name: actor.name,
                surname: actor.surname,
                email: actor.email,
                password: actor.password,
                phoneNumber: actor.phoneNumber,
                address: actor.address,
                roles
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

        this.loading = false
    }
}
