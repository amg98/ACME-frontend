import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { TranslatorService } from "@services/translator.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent extends TranslatableComponent {

    editProfileText!: string;
    nameText!: string;
    surnameText!: string;
    requiredFieldText!: string;
    emailText!: string;
    emailValidationText!: string;
    passwordText!: string;
    repeatPasswordText!: string;
    minimumValidationText!: string;
    passwordMatchText!: string;
    phoneNumberText!: string;
    phoneNumberValidationText!: string;
    addressText!: string;
    saveText!: string;
    adminText!: string;
    explorerText!: string;
    sponsorText!: string;
    managerText!: string;
    oneRoleAtLeastText!: string;
    profileForm: FormGroup;
    closeText!: string;
    saveSuccessText!: string;
    saveFailureText!: string;

    constructor(translator: TranslatorService,
                private formBuilder: FormBuilder,
                private actorsService: ActorsService,
                private snackbar: MatSnackBar) {
        super(translator);

        this.setLanguageChangeListener(() => {
            this.editProfileText = translator.getString("edit-profile");
            this.nameText = translator.getString("name");
            this.surnameText = translator.getString("surname");
            this.requiredFieldText = translator.getString("required-field");
            this.emailText = translator.getString("email");
            this.emailValidationText = translator.getString("email-validation");
            this.passwordText = translator.getString("password");
            this.repeatPasswordText = translator.getString("repeat-password");
            this.minimumValidationText = translator.getString("minimum-5");
            this.passwordMatchText = translator.getString("passwords-dont-match");
            this.phoneNumberText = translator.getString("phone-number");
            this.phoneNumberValidationText = translator.getString("phonenumber-validation");
            this.addressText = translator.getString("address");
            this.saveText = translator.getString("save");
            this.adminText = translator.getString("admin");
            this.explorerText = translator.getString("explorer");
            this.sponsorText = translator.getString("sponsor");
            this.managerText = translator.getString("manager");
            this.oneRoleAtLeastText = translator.getString("one-role-at-least");
            this.closeText = translator.getString("close");
            this.saveSuccessText = translator.getString("save-success");
            this.saveFailureText = translator.getString("save-failure");
        });

        this.profileForm = this.formBuilder.group({
            name: ["", [Validators.required]],
            surname: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(5)]],
            repeatPassword: ["", [Validators.required, Validators.minLength(5)]],
            phoneNumber: ["", [Validators.pattern(/^[0-9]+$/)]],
            address: ["", []],
            isAdmin: [{ value: false, disabled: true }, []],
            isManager: [{ value: false, disabled: true }, []],
            isExplorer: [false, []],
            isSponsor: [false, []],
        }, { validators: [this.checkPasswords, this.checkRoles] });

        actorsService.subscribeToLoggedActor(actor => {
            if(!actor) return;
            this.profileForm.setValue({
                name: actor.name,
                surname: actor.surname,
                email: actor.email,
                password: "",
                repeatPassword: "",
                phoneNumber: actor.phoneNumber,
                address: actor.address,
                isAdmin: actor.roles.includes("ADMINISTRATOR"),
                isManager: actor.roles.includes("MANAGER"),
                isExplorer: actor.roles.includes("EXPLORER"),
                isSponsor: actor.roles.includes("SPONSOR")
            });
        });
    }

    checkPasswords(group: FormGroup): Record<string, boolean> | null {
        const password = group.get("password")?.value;
        const confirmPassword = group.get("repeatPassword")?.value;

        return password === confirmPassword ? null : { passwordsDontMatch: true };
    }

    checkRoles(group: FormGroup): Record<string, boolean> | null {
        const isAdmin = group.get("isAdmin")?.value;
        const isManager = group.get("isManager")?.value;
        const isExplorer = group.get("isExplorer")?.value;
        const isSponsor = group.get("isSponsor")?.value;

        return isAdmin || isManager || isExplorer || isSponsor ? null : { oneRoleAtLeast: true };
    }

    async onSubmit(): Promise<void> {
        if (!this.profileForm.valid) return;

        const actor = this.profileForm.value;

        const roles = [];
        if(actor.isAdmin) roles.push("ADMINISTRATOR");
        if(actor.isManager) roles.push("MANAGER");
        if(actor.isExplorer) roles.push("EXPLORER");
        if(actor.isSponsor) roles.push("SPONSOR");

        try {
            await this.actorsService.updateLoggedActor({
                name: actor.name,
                surname: actor.surname,
                email: actor.email,
                password: actor.password,
                phoneNumber: actor.phoneNumber,
                address: actor.address,
                roles,
            });

            this.snackbar.open(this.saveSuccessText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-success" ]
            });
        } catch {
            this.snackbar.open(this.saveFailureText, this.closeText, {
                duration: 5000,
                panelClass: [ "alert-error" ]
            });
        }
    }
}
