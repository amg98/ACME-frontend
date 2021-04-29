import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegisterComponent } from "@components/forms/register/register.component";
import { LoginComponent } from "@components/forms/login/login.component";
import { ProfileComponent } from "@components/forms/profile/profile.component";
import { DashboardComponent } from "@components/dashboard/dashboard.component";

const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent },
    { path: "admin/dashboard", component: DashboardComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
