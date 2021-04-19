import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from"@angular/material/button";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RegisterComponent } from "./components/forms/register/register.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
