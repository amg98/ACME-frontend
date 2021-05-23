import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { MatDialogModule } from "@angular/material/dialog"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { ApplicationsService, GetManagerApplicationsData } from "@services/applications.service"
import { TranslatorService } from "@services/translator.service"
import { ApplicationStatus } from "src/app/models/Application"
import { Trip } from "src/app/models/Trip"

import { ManagerApplicationsComponent } from "./applications.component"

describe("ManagerApplicationsComponent", () => {

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
        isPublished: true,
        price: 120,
        stages: [
            {
                title: "Stage 1",
                description: "Stage 1 description",
                price: 120,
            }
        ],
    }

    let component: ManagerApplicationsComponent
    let fixture: ComponentFixture<ManagerApplicationsComponent>
    let appsService: ApplicationsService

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManagerApplicationsComponent],
            imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule],
            providers: [ApplicationsService, TranslatorService]
        }).compileComponents()

        appsService = TestBed.inject(ApplicationsService)
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ManagerApplicationsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it("should create", () => {
        expect(component).toBeTruthy()
    })

    it("List the applications of a trip that has at least two applications", fakeAsync(() => {

        const explorerIDs = ["1", "2"]

        const mockData: GetManagerApplicationsData = {
            trips: [sampleTrip],
            apps: [
                [
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
            ],
            explorers: [
                [
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
                ],
            ]
        }

        spyOn(appsService, "getManagerApplications").and.returnValue(Promise.resolve(mockData))
        component.ngOnInit()
        tick()

        expect(component.loading).toEqual([[false, false]])
        expect(component.data).toEqual(mockData)
    }))

    it("List the applications of a trip that has no applications", fakeAsync(() => {

        const mockData: GetManagerApplicationsData = {
            trips: [sampleTrip],
            apps: [[]],
            explorers: [[]],
        }

        spyOn(appsService, "getManagerApplications").and.returnValue(Promise.resolve(mockData))
        component.ngOnInit()
        tick()

        expect(component.loading).toEqual([[]])
        expect(component.data).toEqual(mockData)
    }))
})
