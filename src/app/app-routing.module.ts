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
import { ManagerGuard } from "./guards/manager.guard"
import { FavouriteListsComponent } from "@components/favourite-lists/favourite-lists.component"
import { ExplorerGuard } from "./guards/explorer.guard"

export const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "admin/dashboard", component: DashboardComponent, canActivate: [AdminGuard] },
    { path: "admin/users", component: UsersListComponent, canActivate: [AdminGuard] },
    { path: "admin/cube", component: CubeComponent, canActivate: [AdminGuard] },
    { path: "manager/apps", component: ManagerApplicationsComponent, canActivate: [ManagerGuard] },
    { path: "explorer/favourite-lists", component: FavouriteListsComponent, canActivate: [ExplorerGuard] }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
