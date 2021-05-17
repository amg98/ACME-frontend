import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { environment } from "@env/environment"
import { Actor } from "../models/Actor"
import { ActorsService } from "./actors.service"

fdescribe("ActorsService", () => {
    let httpMock: HttpTestingController

    const actor: Actor = {
        _id: "123",
        name: "name",
        surname: "surname",
        email: "email@mail.com",
        roles: []
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        httpMock = TestBed.inject(HttpTestingController)
    })

    it("should not login", () => {
        spyOn(localStorage, "getItem").and.callFake(() => null)
        const service = TestBed.inject(ActorsService)
        expect(service).toBeTruthy()
        expect(service.getLoggedActor()).toBeNull()
    })

    it("network error on automatic login", fakeAsync(() => {
        const idToken = "123"
        spyOn(localStorage, "getItem").and.callFake(() => idToken)
        const removeItem = spyOn(localStorage, "removeItem")

        const service = TestBed.inject(ActorsService)
        const httpRequest = httpMock.expectOne(`${environment.backendURL}/auth/id/${idToken}`)
        httpRequest.flush({}, { status: 500, statusText: "Error" })
        tick()

        expect(service.getLoggedActor()).toBeNull()
        expect(removeItem).toHaveBeenCalledOnceWith("idToken")
    }))

    it("correct automatic login", fakeAsync(() => {
        const idToken = "123"
        spyOn(localStorage, "getItem").and.callFake(() => idToken)

        const service = TestBed.inject(ActorsService)
        const httpRequest = httpMock.expectOne(`${environment.backendURL}/auth/id/${idToken}`)
        httpRequest.flush({ actor }, { status: 200, statusText: "OK" })
        tick()

        expect(service.getLoggedActor()).toBe(actor)
    }))

    it("correct logout", fakeAsync(() => {
        spyOn(localStorage, "getItem").and.callFake(() => null)
        const removeItem = spyOn(localStorage, "removeItem")

        const service = TestBed.inject(ActorsService)
        service.logout()

        expect(removeItem).toHaveBeenCalledOnceWith("idToken")
        expect(service.getLoggedActor()).toBeNull()
    }))

    it("correct login", fakeAsync(() => {
        spyOn(localStorage, "getItem").and.callFake(() => null)
        const setItem = spyOn(localStorage, "setItem")
        const customToken = "customToken"
        const idToken = "idToken"

        const service = TestBed.inject(ActorsService)
        service.login("a@a.com", "aaaaa")
        httpMock.expectOne(`${environment.backendURL}/auth/login`)
            .flush({ customToken, actor }, { status: 200, statusText: "OK" })
        tick()
        httpMock.expectOne(`${environment.backendURL}/auth/custom/${customToken}`)
            .flush({ idToken }, { status: 200, statusText: "OK" })
        tick()

        expect(service.getLoggedActor()).toBe(actor)
        expect(setItem).toHaveBeenCalledOnceWith("idToken", idToken)
    }))

    it("wrong login", fakeAsync(() => {
        spyOn(localStorage, "getItem").and.callFake(() => null)

        const service = TestBed.inject(ActorsService)
        service.login("a@a.com", "aaaaa")
        httpMock.expectOne(`${environment.backendURL}/auth/login`)
            .flush({ status: 500, statusText: "Error" })
        tick()

        expect(service.getLoggedActor()).toBe(null)
    }))

    it("correct update logged actor", fakeAsync(() => {
        const idToken = "123"
        spyOn(localStorage, "getItem").and.callFake(() => idToken)

        const service = TestBed.inject(ActorsService)
        httpMock.expectOne(`${environment.backendURL}/auth/id/${idToken}`)
            .flush({ actor }, { status: 200, statusText: "OK" })
        tick()

        const updatedActor = { ...actor, name: "newName" }
        service.updateLoggedActor(updatedActor)
        httpMock.expectOne(`${environment.backendURL}/actors`)
            .flush({ updatedActor }, { status: 200, statusText: "OK" })
        tick()

        expect(service.getLoggedActor()).toBe(updatedActor)
    }))

    it("wrong update logged actor", fakeAsync(() => {
        const idToken = "123"
        spyOn(localStorage, "getItem").and.callFake(() => idToken)

        const service = TestBed.inject(ActorsService)
        httpMock.expectOne(`${environment.backendURL}/auth/id/${idToken}`)
            .flush({ actor }, { status: 200, statusText: "OK" })
        tick()

        const updatedActor = { ...actor, name: "newName" }
        try {
            service.updateLoggedActor(updatedActor)
            httpMock.expectOne(`${environment.backendURL}/actors`)
                .flush({}, { status: 500, statusText: "Error" })
            tick()
            fail()
        // eslint-disable-next-line no-empty
        } catch {}

        expect(service.getLoggedActor()).toBe(actor)
    }))
})
