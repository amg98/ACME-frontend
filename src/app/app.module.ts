import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { PlotlyModule } from "angular-plotly.js"

PlotlyModule.plotlyjs = require("plotly.js/dist/plotly.js")

import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RegisterComponent } from "./components/forms/register/register.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component"
import { TranslatableComponent } from "./components/translatable/translatable.component"
import { LoginComponent } from "./components/forms/login/login.component"
import { ProfileComponent } from "./components/forms/profile/profile.component"
import { FinderComponent } from "./components/finder/finder.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { FooterComponent } from "./components/footer/footer.component"
import { TokenInterceptor } from "./interceptors/token.interceptor"
import { PieChartComponent } from "./components/stats/pie-chart/pie-chart.component"
import { TableComponent } from "./components/stats/table/table.component"
import { KeywordsTableComponent } from "./components/stats/keywords-table/keywords-table.component"
import { ThemeSwitchComponent } from "./components/theme-switch/theme-switch.component"
import { UsersListComponent } from "./components/users-list/users-list.component"
import { CubeComponent } from "./components/stats/cube/cube.component"

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
        FooterComponent,
        PieChartComponent,
        TableComponent,
        KeywordsTableComponent,
        ThemeSwitchComponent,
        UsersListComponent,
        CubeComponent,
    ],
    imports: [
        CommonModule,
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
        MatIconModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        PlotlyModule,
        MatSlideToggleModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
