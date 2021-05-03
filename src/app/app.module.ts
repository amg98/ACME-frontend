import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RegisterComponent } from "./components/forms/register/register.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { TranslatableComponent } from "./components/translatable/translatable.component";
import { LoginComponent } from "./components/forms/login/login.component";
import { ProfileComponent } from "./components/forms/profile/profile.component";
import { FinderComponent } from "./components/finder/finder.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        NavbarComponent,
        LanguageSelectorComponent,
        TranslatableComponent,
        LoginComponent,
        ProfileComponent,
        FinderComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
