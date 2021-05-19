import { TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { ActorsService } from "@services/actors.service"
import { HttpClientTestingModule } from "@angular/common/http/testing"

import { AdminGuard } from "./admin.guard"
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router"

const fakeRouterState = (url: string): RouterStateSnapshot => {
    return {
        url,
    } as RouterStateSnapshot
}

describe("AdminGuard", () => {
    let guard: AdminGuard
    let actorsService: ActorsService
    let router: Router

    const allowedActor = {
        name: "name",
        surname: "surname",
        email: "a@a.com",
        roles: ["ADMINISTRATOR"]
    }

    const deniedActor = {
        ...allowedActor,
        roles: []
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule
            ],
            providers: [
                ActorsService
            ]
        })
        guard = TestBed.inject(AdminGuard)
        actorsService = TestBed.inject(ActorsService)
        router = TestBed.inject(Router)
    })

    it("should be created", () => {
        expect(guard).toBeTruthy()
    })

    it("should allow access", () => {
        spyOn(router, "navigate").and.callFake(async () => true)
        spyOn(actorsService, "getLoggedActor").and.returnValue(allowedActor)
        const result = guard.canActivate(new ActivatedRouteSnapshot(), fakeRouterState(""))
        expect(router.navigate).not.toHaveBeenCalled()
        expect(result).toBe(true)
    })

    it("should deny access", () => {
        spyOn(router, "navigate").and.callFake(async () => true)
        spyOn(actorsService, "getLoggedActor").and.returnValue(deniedActor)
        const result = guard.canActivate(new ActivatedRouteSnapshot(), fakeRouterState(""))
        expect(router.navigate).toHaveBeenCalledWith(["/"])
        expect(result).toBe(false)
    })
})
