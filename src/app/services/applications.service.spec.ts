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

    const tripID = "123"
    const sampleTrip: Trip = {
        _id: tripID,
        ticker: "210510-IMUZ",
        title: "Trip title",
        requirements: ["R1", "R2", "R3"],
        startDate: "2021-05-20T12:46:31.290Z",
        endDate: "2021-06-20T12:46:31.290Z",
        pictures: ["https://images.io/image.jpg"],
        cancelReason: "",
        isCancelled: false,
        description:"",
        isPublished: true,
        price: 120,
        stages:[
            {
                title: "Stage 1",
                description: "Stage 1 description",
                price: 120,
            }
        ],
        managerID: "6098ffd610a440000febf5ff"
    }

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

    it("List the applications of a trip that has at least two applications", fakeAsync(() => {

        const explorerIDs = ["1", "2"]

        const apps: Application[] = [
            {
                status: ApplicationStatus.Pending,
                tripID: tripID,
                explorerID: explorerIDs[0],
                timeStamp: new Date().toISOString(),
            },
            {
                status: ApplicationStatus.Accepted,
                tripID: tripID,
                explorerID: explorerIDs[1],
                timeStamp: new Date().toISOString(),
            },
        ]

        const explorers = [
            {
                _id: explorerIDs[0],
                name: "User 1",
                surname: "Surname 1",
                email: "a@a.com",
                roles: ["EXPLORER"],
            },
            {
                _id: explorerIDs[1],
                name: "User 2",
                surname: "Surname 2",
                email: "b@b.com",
                roles: ["EXPLORER"],
            }
        ]

        const getTripsByManager = spyOn(tripsService, "getTripsByManager").and.returnValue(Promise.resolve([sampleTrip]))
        const getActorSummary = spyOn(actorsService, "getActorSummary").and.returnValues(Promise.resolve(explorers[0]), Promise.resolve(explorers[1]))
        service.getManagerApplications().then(data => {
            expect(data.apps).toEqual([apps])
            expect(data.explorers).toEqual([explorers])
            expect(data.trips).toEqual([sampleTrip])
        })
        tick()
        httpMock.expectOne(`${environment.backendURL}/applications/trips/${sampleTrip._id}`)
            .flush(apps, { status: 200, statusText: "OK" })
        tick()
        tick()

        expect(getTripsByManager).toHaveBeenCalled()
        expect(getActorSummary).toHaveBeenCalledWith(explorers[0]._id)
        expect(getActorSummary).toHaveBeenCalledWith(explorers[1]._id)
    }))

    it("List the applications of a trip that has no applications", fakeAsync(() => {

        const apps: Application[] = []

        const explorers: Actor[] = []

        const getTripsByManager = spyOn(tripsService, "getTripsByManager").and.returnValue(Promise.resolve([sampleTrip]))
        const getActorSummary = spyOn(actorsService, "getActorSummary").and.returnValue(Promise.resolve({
            _id: "1",
            name: "User 1",
            surname: "Surname 1",
            email: "a@a.com",
            roles: ["EXPLORER"],
        }))

        service.getManagerApplications().then(data => {
            expect(data.apps).toEqual([apps])
            expect(data.explorers).toEqual([explorers])
            expect(data.trips).toEqual([sampleTrip])
        })
        tick()
        httpMock.expectOne(`${environment.backendURL}/applications/trips/${sampleTrip._id}`)
            .flush(apps, { status: 200, statusText: "OK" })
        tick()
        tick()

        expect(getTripsByManager).toHaveBeenCalled()
        expect(getActorSummary).not.toHaveBeenCalled()
    }))
})
