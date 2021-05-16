import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends TranslatableComponent {

    loginText!: string;
    requiredFieldText!: string;
    emailText!: string;
    emailValidationText!: string;
    passwordText!: string;
    loginForm: FormGroup;
    closeText!: string;
    loginSuccessText!: string;
    loginFailureText!: string;

    constructor(translator: TranslatorService,
        private formBuilder: FormBuilder,
        private actorsService: ActorsService,
        private router: Router,
        private snackbar: MatSnackBar) {
        super(translator);

        this.setLanguageChangeListener(() => {
            this.loginText = translator.getString("login");
            this.requiredFieldText = translator.getString("required-field");
            this.emailText = translator.getString("email");
            this.emailValidationText = translator.getString("email-validation");
            this.passwordText = translator.getString("password");
            this.closeText = translator.getString("close");
            this.loginSuccessText = translator.getString("login-success");
            this.loginFailureText = translator.getString("login-failure");
        });

        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required]],
            password: ["", [Validators.required]],
        });
    }

    async onSubmit(): Promise<void> {
        if (!this.loginForm.valid) return;

        try {
            await this.actorsService.login(this.loginForm.value.email, this.loginForm.value.password);
            
            this.snackbar.open(this.loginSuccessText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-success" ]
            });
            this.router.navigate(["/trips"]);
        } catch {
            this.loginForm.reset();
            this.snackbar.open(this.loginFailureText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-error" ]
            });
        }
    }
}
