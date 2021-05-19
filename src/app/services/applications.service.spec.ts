import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { environment } from "@env/environment"
import { Actor } from "../models/Actor"
import { Application, ApplicationStatus } from "../models/Application"
import { Trip } from "../models/Trip"
import { ActorsService } from "./actors.service"

import { ApplicationsService } from "./applications.service"
import { TripsService } from "./trips.service"

describe("ApplicationsService", () => {
    let service: ApplicationsService
    let httpMock: HttpTestingController
    let actorsService: ActorsService
    let tripsService: TripsService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TripsService, ActorsService]
        })
        actorsService = TestBed.inject(ActorsService)
        tripsService = TestBed.inject(TripsService)
        service = TestBed.inject(ApplicationsService)
        httpMock = TestBed.inject(HttpTestingController)
    })

    it("should be created", () => {
        expect(service).toBeTruthy()
    })

    it("should get manager applications", fakeAsync(() => {
        const tripID = "1"
        const trip: Trip = {
            _id: tripID,
            ticker: "string",
            title: "string",
            requirements: ["string"],
            startDate: "string",
            endDate: "string",
            pictures: ["string"],
            cancelReason: "string",
            isCancelled: false,
            isPublished: true,
            price: 120,
            stages: [{ title: "string", description: "string", price: 120 }],
        }
        const explorerID = "123"
        const explorer: Actor = {
            _id: explorerID,
            name: "name",
            surname: "surname",
            email: "email@mail.com",
            roles: []
        }
        const app: Application = {
            status: ApplicationStatus.Due,
            tripID: tripID,
            explorerID: explorerID,
            timeStamp: "string",
        }

        const getTripsByManager = spyOn(tripsService, "getTripsByManager").and.returnValue(Promise.resolve([trip]))
        const getActorSummary = spyOn(actorsService, "getActorSummary").and.returnValue(Promise.resolve(explorer))
        service.getManagerApplications().then(data => {
            expect(data.apps).toEqual([[app]])
            expect(data.explorers).toEqual([[explorer]])
            expect(data.trips).toEqual([trip])
        })
        tick()
        httpMock.expectOne(`${environment.backendURL}/applications/trips/${trip._id}`)
            .flush([app], { status: 200, statusText: "OK" })
        tick()
        tick()

        expect(getTripsByManager).toHaveBeenCalled()
        expect(getActorSummary).toHaveBeenCalledOnceWith(explorerID)
    }))
})
