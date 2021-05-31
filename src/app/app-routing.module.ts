import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { RegisterComponent } from "@components/forms/register/register.component"
import { LoginComponent } from "@components/forms/login/login.component"
import { ProfileComponent } from "@components/forms/profile/profile.component"
import { DashboardComponent } from "@components/dashboard/dashboard.component"
import { AuthGuard } from "./guards/auth.guard"
import { AdminGuard } from "./guards/admin.guard"
import { UsersListComponent } from "@components/users-list/users-list.component"
import { CubeComponent } from "@components/stats/cube/cube.component"
import { ManagerApplicationsComponent } from "@components/manager/applications/applications.component"
import { TripsManagerListComponent } from "@components/manager/trips-manager-list/trips-manager-list.component"
import { ManagerGuard } from "./guards/manager.guard"
import { FavouriteListsComponent } from "@components/favourite-lists/favourite-lists.component"
import { ExplorerGuard } from "./guards/explorer.guard"
import { SponsorshipsComponent } from "@components/sponsorships/sponsorships.component"
import { SponsorGuard } from "./guards/sponsor.guard"
import { SponsorshipPaymentComponent } from "@components/sponsorship-payment/sponsorship-payment.component"
import { TripDisplayComponent } from "./components/trips/trip-display/trip-display.component"
import { TripFormComponent } from "./components/trips/trip-form/trip-form.component"
import { TripListComponent } from "./components/trips/trip-list/trip-list.component"
import { SponsorshipComponent } from "@components/forms/sponsorship/sponsorship.component"
import { AppsExplorerListComponent } from "@components/apps-explorer-list/apps-explorer-list.component"
import { PreferencesComponent } from "@components/preferences/preferences.component"
import { AdvancedfinderComponent } from "@components/advanced-finder/advanced-finder.component"
import { ApplicationPaymentComponent } from "@components/application-payment/application-payment.component"
import { FinderConfigComponent } from "@components/finder-config/finder-config.component"


export const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "admin/dashboard", component: DashboardComponent, canActivate: [AdminGuard] },
    { path: "admin/users", component: UsersListComponent, canActivate: [AdminGuard] },
    { path: "admin/cube", component: CubeComponent, canActivate: [AdminGuard] },
    { path: "applications", component: AppsExplorerListComponent, canActivate: [ExplorerGuard] },
    { path: "finder/config", component: FinderConfigComponent, canActivate: [ExplorerGuard] },
    { path: "application-payment", component: ApplicationPaymentComponent },
    { path: "manager/apps", component: ManagerApplicationsComponent, canActivate: [ManagerGuard] },
    { path: "manager/trips", component: TripsManagerListComponent, canActivate: [ManagerGuard] },
    { path: "explorer/favourite-lists", component: FavouriteListsComponent, canActivate: [ExplorerGuard] },
    { path: "explorer/preferences", component: PreferencesComponent, canActivate: [ExplorerGuard] },
    { path: "sponsor/sponsorships", component: SponsorshipsComponent, canActivate: [SponsorGuard] },
    { path: "sponsorship-payment", component: SponsorshipPaymentComponent },
    { path: "sponsorship-form", component: SponsorshipComponent, canActivate: [SponsorGuard] },
    {
        path: "trips", children: [
            { path: "", component: TripListComponent },
            { path: "", component: AdvancedfinderComponent },
            { path: "finder", component: TripListComponent },
            { path: "new", component: TripFormComponent },
            { path: ":id", component: TripFormComponent },
            { path: "search", component: TripListComponent },
            { path: "display/:id", component: TripDisplayComponent },

        ]
    },
    { path: "",redirectTo: "trips", pathMatch: "full"},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
