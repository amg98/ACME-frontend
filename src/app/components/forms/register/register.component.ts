import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent extends TranslatableComponent {

    registerForm: FormGroup;
    registerFormText!: string;
    nameText!: string;
    surnameText!: string;
    requiredFieldText!: string;
    emailText!: string;
    emailValidationText!: string;
    passwordText!: string;
    repeatPasswordText!: string;
    minimumValidationText!: string;
    phoneNumberText!: string;
    addressText!: string;
    wannabeSponsorText!: string;
    registerText!: string;
    phoneNumberValidationText!: string;
    passwordMatchText!: string;
    registrationSuccessText!: string;
    registrationFailureText!: string;
    closeText!: string;

    constructor(translator: TranslatorService,
                private formBuilder: FormBuilder,
                private actorsService: ActorsService,
                private router: Router,
                private snackbar: MatSnackBar) {
        super(translator);

        this.setLanguageChangeListener(() => {
            this.registerFormText = translator.getString("register-form");
            this.nameText = translator.getString("name");
            this.surnameText = translator.getString("surname");
            this.requiredFieldText = translator.getString("required-field");
            this.emailText = translator.getString("email");
            this.emailValidationText = translator.getString("email-validation");
            this.passwordText = translator.getString("password");
            this.repeatPasswordText = translator.getString("repeat-password");
            this.minimumValidationText = translator.getString("minimum-5");
            this.phoneNumberText = translator.getString("phone-number");
            this.addressText = translator.getString("address");
            this.wannabeSponsorText = translator.getString("wannabe-sponsor");
            this.registerText = translator.getString("register");
            this.phoneNumberValidationText = translator.getString("phonenumber-validation");
            this.passwordMatchText = translator.getString("passwords-dont-match");
            this.registrationSuccessText = translator.getString("registration-success");
            this.registrationFailureText = translator.getString("registration-failure");
            this.closeText = translator.getString("close");
        });

        this.registerForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            surname: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(5)]],
            repeatPassword: ["", [Validators.required, Validators.minLength(5)]],
            phoneNumber: ["", [Validators.pattern(/^[0-9]+$/)]],
            address: ["", []],
            isSponsor: [false, []],
        }, { validators: this.checkPasswords });
    }

    checkPasswords(group: FormGroup): Record<string, boolean> | null {
        const password = group.get("password")?.value;
        const confirmPassword = group.get("repeatPassword")?.value;

        return password === confirmPassword ? null : { passwordsDontMatch: true };
    }

    async onSubmit(): Promise<void> {
        if (!this.registerForm.valid) return;

        const actor = this.registerForm.value;

        try {
            await this.actorsService.registerActor({
                name: actor.name,
                surname: actor.surname,
                email: actor.email,
                password: actor.password,
                phoneNumber: actor.phoneNumber,
                address: actor.address,
                roles: actor.isSponsor ? ["EXPLORER", "SPONSOR"] : ["EXPLORER"],
            });

            this.snackbar.open(this.registrationSuccessText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-success" ]
            });
            this.router.navigate(["/"]);
        } catch {
            this.snackbar.open(this.registrationFailureText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-error" ]
            });
        }
    }
}
