import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegisterComponent } from "@components/forms/register/register.component";
import { LoginComponent } from "@components/forms/login/login.component";
import { ProfileComponent } from "@components/forms/profile/profile.component";
import { DashboardComponent } from "@components/dashboard/dashboard.component";
import { TripDisplayComponent } from "@components/trip/trip-display/trip-display.component";
import { TripListComponent } from "@components/trip/trip-list/trip-list.component";
import { TripFormComponent } from "@components/trip/trip-form/trip-form.component";

const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent },
    { path: "admin/dashboard", component: DashboardComponent },
    
    {path: "trips", children: [
        {path: "new", component: TripFormComponent},
        {path: "search", component: TripListComponent},
        {path: "display/:id", component: TripDisplayComponent},
        {path: "", component: TripListComponent},
        {path: "finder", component: TripListComponent},
    ]},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
