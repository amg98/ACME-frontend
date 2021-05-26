import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
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
import { MatDialogModule } from "@angular/material/dialog"
import { MatExpansionModule } from "@angular/material/expansion"

import { MatCarouselModule } from "@ngmodule/material-carousel"
import {MatGridListModule} from "@angular/material/grid-list"
import { MatFileUploadModule } from "angular-material-fileupload"
import {MatDatepickerModule} from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatMenuModule } from "@angular/material/menu"


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
import { ManagerApplicationsComponent } from "./components/manager/applications/applications.component"
import { RejectApplicationComponent } from "./components/dialog/reject-application/reject-application.component"
import { TripsManagerListComponent } from "./components/manager/trips-manager-list/trips-manager-list.component"
import { FavouriteListsComponent } from "./components/favourite-lists/favourite-lists.component"
import { CancelTripComponent } from "./components/dialog/cancel-trip/cancel-trip.component"
import { SponsorshipsComponent } from "./components/sponsorships/sponsorships.component"
import { FlatRateComponent } from "./components/flat-rate/flat-rate.component"
import { DialogFlatRateComponent } from "./components/dialog/flat-rate/flat-rate.component"

import { SponsorshipPaymentComponent } from "./components/sponsorship-payment/sponsorship-payment.component"
import { TripDisplayComponent } from "./components/trips/trip-display/trip-display.component"
import { TripFormComponent } from "./components/trips/trip-form/trip-form.component"
import { TripListComponent } from "./components/trips/trip-list/trip-list.component"
import { SponsorshipComponent } from "./components/forms/sponsorship/sponsorship.component"
import { NewFavouriteListComponent } from "./components/dialog/new-favourite-list/new-favourite-list.component"
import { EditFavouriteListComponent } from "./components/dialog/edit-favourite-list/edit-favourite-list.component"
import { AddToFavouritesComponent } from "./components/add-to-favourites/add-to-favourites.component"
import { AppsExplorerListComponent } from "./components/apps-explorer-list/apps-explorer-list.component";
import { PreferencesComponent } from './components/preferences/preferences.component'


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
        ManagerApplicationsComponent,
        RejectApplicationComponent,
        TripsManagerListComponent,
        FavouriteListsComponent,
        SponsorshipsComponent,
        CancelTripComponent,
        FlatRateComponent,
        DialogFlatRateComponent,
        SponsorshipPaymentComponent,
        TripDisplayComponent,
        TripFormComponent,
        FooterComponent,
        TripListComponent,
        SponsorshipComponent,
        NewFavouriteListComponent,
        EditFavouriteListComponent,
        AddToFavouritesComponent,
        AppsExplorerListComponent,
        PreferencesComponent,
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
        MatDialogModule,
        MatExpansionModule,
        MatMenuModule,
        PlotlyModule,
        MatSlideToggleModule,
        FormsModule,
        MatCarouselModule,
        MatGridListModule,
        MatFormFieldModule, 
        MatFileUploadModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
}
