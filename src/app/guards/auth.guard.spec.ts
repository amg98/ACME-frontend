import { TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { ActorsService } from "@services/actors.service"
import { HttpClientTestingModule } from "@angular/common/http/testing"

import { AuthGuard } from "./auth.guard"
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router"

const fakeRouterState = (url: string): RouterStateSnapshot => {
    return {
        url,
    } as RouterStateSnapshot
}

describe("AuthGuard", () => {
    let guard: AuthGuard
    let actorsService: ActorsService
    let router: Router

    const sampleActor = {
        name: "name",
        surname: "surname",
        email: "a@a.com",
        roles: ["MANAGER"]
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
        guard = TestBed.inject(AuthGuard)
        actorsService = TestBed.inject(ActorsService)
        router = TestBed.inject(Router)
    })

    it("should be created", () => {
        expect(guard).toBeTruthy()
    })

    it("should allow access", () => {
        spyOn(router, "navigate").and.callFake(async () => true)
        spyOn(actorsService, "getLoggedActor").and.returnValue(sampleActor)
        const result = guard.canActivate(new ActivatedRouteSnapshot(), fakeRouterState(""))
        expect(router.navigate).not.toHaveBeenCalled()
        expect(result).toBe(true)
    })

    it("should deny access with null", () => {
        spyOn(router, "navigate").and.callFake(async () => true)
        spyOn(actorsService, "getLoggedActor").and.returnValue(null)
        const result = guard.canActivate(new ActivatedRouteSnapshot(), fakeRouterState(""))
        expect(router.navigate).toHaveBeenCalledWith(["/"])
        expect(result).toBe(false)
    })

    it("should deny access with undefined", () => {
        spyOn(router, "navigate").and.callFake(async () => true)
        spyOn(actorsService, "getLoggedActor").and.returnValue(undefined)
        const result = guard.canActivate(new ActivatedRouteSnapshot(), fakeRouterState(""))
        expect(router.navigate).toHaveBeenCalledWith(["/"])
        expect(result).toBe(false)
    })
})
