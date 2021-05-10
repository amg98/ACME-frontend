import { Injectable } from "@angular/core"
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router"
import { ActorsService } from "@services/actors.service"
import { Observable } from "rxjs"

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(private actorsService: ActorsService, private router: Router) { }

    canActivate(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        route: ActivatedRouteSnapshot,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!this.actorsService.getLoggedActor()) {
            this.router.navigate(["/"])
            return false
        }

        return true
    }

}
