import { HttpClientTestingModule } from "@angular/common/http/testing"
import { Injectable } from "@angular/core"
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing"
import { MatCardModule } from "@angular/material/card"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { ApplicationPaymentComponent } from "@components/application-payment/application-payment.component"
import { AppsExplorerListComponent } from "@components/apps-explorer-list/apps-explorer-list.component"
import { ManagerApplicationsComponent } from "@components/manager/applications/applications.component"
import { TripDisplayComponent } from "@components/trips/trip-display/trip-display.component"
import { environment } from "@env/environment"
import { MatCarouselModule } from "@ngmodule/material-carousel"
import { ActorsService } from "@services/actors.service"
import { ApplicationsService, GetManagerApplicationsData } from "@services/applications.service"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"
import { BehaviorSubject, Observable, Subscription } from "rxjs"
import { Actor } from "./models/Actor"
import { ApplicationStatus } from "./models/Application"
import { Trip } from "./models/Trip"

@Injectable()
class ActivatedRouteStub {
    private subject = new BehaviorSubject(this.testParams)
    params = this.subject.asObservable()

    private _testParams = {}
    get testParams() { return this._testParams }
    set testParams(params) {
        this._testParams = params
        this.subject.next(params)
    }

    queryParams = {
        subscribe: (fun: (arg0: unknown) => unknown) => fun(this._testParams)
    }

    get snapshot() {
        return { params: this.testParams }
    }
}

const rejectReason = "Rejected because of yes"

@Injectable()
class MatDialogRefStub {
    afterClosed(): Observable<string> {
        return new Observable(observer => observer.next(rejectReason))
    }
}

@Injectable()
class MatDialogStub {

    open(): MatDialogRefStub {
        return new MatDialogRefStub()
    }
}

describe("Apply for a trip", () => {

    const tripID = "123"
    const actorID = "12"
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
        managerID: "123",
        stages: [
            {
                title: "Stage 1",
                description: "Stage 1 description",
                price: 120,
            }
        ],
    }

    const sampleActor: Actor = {
        _id: actorID,
        name: "name",
        surname: "surname",
        email: "email@mail.com",
        roles: ["EXPLORER"],
    }

    const dueAppID = "12345"
    const dueApp = {
        _id: dueAppID,
        status: ApplicationStatus.Due,
        tripID: tripID,
        explorerID: actorID,
        timeStamp: new Date().toISOString(),
    }
    const appsData: GetManagerApplicationsData = {
        trips: [sampleTrip],
        apps: [
            [
                {
                    _id: "1",
                    status: ApplicationStatus.Pending,
                    tripID: tripID,
                    explorerID: actorID,
                    timeStamp: new Date().toISOString(),
                }
            ]
        ],
        explorers: [
            [ sampleActor ],
        ]
    }

    let managerAppsComp: ManagerApplicationsComponent
    let appsExplorerListComp: AppsExplorerListComponent
    let tripDisplayComp: TripDisplayComponent

    let managerAppsFixture: ComponentFixture<ManagerApplicationsComponent>
    let appsExplorerListFixture: ComponentFixture<AppsExplorerListComponent>
    let tripDisplayFixture: ComponentFixture<TripDisplayComponent>

    let mockActivatedRoute: ActivatedRouteStub
    let appsService: ApplicationsService
    let tripsService: TripsService
    let actorsService: ActorsService
    let snackbar: MatSnackBar
    let mockDialog: MatDialogStub

    beforeAll(() => {
        window.onbeforeunload = () => "?"
    })

    beforeEach(async () => {

        mockActivatedRoute = new ActivatedRouteStub()
        mockDialog = new MatDialogStub()

        await TestBed.configureTestingModule({
            declarations: [
                ManagerApplicationsComponent,
                ApplicationPaymentComponent,
                AppsExplorerListComponent,
                TripDisplayComponent
            ],
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                MatSnackBarModule,
                MatProgressSpinnerModule,
                MatCardModule,
                MatCarouselModule,
                MatExpansionModule,
                RouterTestingModule,
                BrowserAnimationsModule,
            ],
            providers: [
                ApplicationsService,
                TripsService,
                ActorsService,
                TranslatorService,
                { provide: MatDialog, useValue: mockDialog },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents()

        // Trip details, /applications (cancel/pay), /manager/apps (accept/cancel), application-payment
        appsService = TestBed.inject(ApplicationsService)
        tripsService = TestBed.inject(TripsService)
        actorsService = TestBed.inject(ActorsService)
        snackbar = TestBed.inject(MatSnackBar)
    })

    beforeEach(() => {
        managerAppsFixture = TestBed.createComponent(ManagerApplicationsComponent)
        managerAppsComp = managerAppsFixture.componentInstance
        managerAppsFixture.detectChanges()

        appsExplorerListFixture = TestBed.createComponent(AppsExplorerListComponent)
        appsExplorerListComp = appsExplorerListFixture.componentInstance
        appsExplorerListFixture.detectChanges()

        tripDisplayFixture = TestBed.createComponent(TripDisplayComponent)
        tripDisplayComp = tripDisplayFixture.componentInstance
        tripDisplayFixture.detectChanges()
    })

    it("should create all components", () => {
        expect(managerAppsComp).toBeTruthy()
        expect(appsExplorerListComp).toBeTruthy()
        expect(tripDisplayComp).toBeTruthy()
    })

    it("apply for a trip", fakeAsync(() => {

        mockActivatedRoute.testParams = { id: tripID }
        spyOn(tripsService, "getTrip").and.returnValue(Promise.resolve(sampleTrip))
        spyOn(actorsService, "subscribeToLoggedActor").and.returnValue(new Subscription())
        spyOn(actorsService, "getLoggedActor").and.returnValue(sampleActor)
        const applyTripSpy = spyOn(tripsService, "applyTrip").and.returnValue(Promise.resolve({}))
        const snackbarSpy = spyOn(snackbar, "open")

        tripDisplayComp.ngOnInit()
        tripDisplayComp.onApply(tripID)
        tick()

        tripDisplayFixture.detectChanges()
        flush()

        expect(applyTripSpy).toHaveBeenCalledOnceWith(tripID, actorID)
        expect(snackbarSpy).toHaveBeenCalledOnceWith("Aplicación creada con éxito", "Cerrar", {
            duration: 5000,
            panelClass: ["alert-success"]
        })
    }))

    it("apply for a trip with error", fakeAsync(() => {

        mockActivatedRoute.testParams = { id: tripID }
        spyOn(tripsService, "getTrip").and.returnValue(Promise.resolve(sampleTrip))
        spyOn(actorsService, "subscribeToLoggedActor").and.returnValue(new Subscription())
        spyOn(actorsService, "getLoggedActor").and.returnValue(sampleActor)
        const applyTripSpy = spyOn(tripsService, "applyTrip").and.returnValue(Promise.reject())
        const snackbarSpy = spyOn(snackbar, "open")

        tripDisplayComp.ngOnInit()
        tripDisplayComp.onApply(tripID)
        tick()

        tripDisplayFixture.detectChanges()
        flush()

        expect(applyTripSpy).toHaveBeenCalledOnceWith(tripID, actorID)
        expect(snackbarSpy).toHaveBeenCalledOnceWith("La aplicación no se ha creado debido a un error, por favor inténtelo más tarde", "Cerrar", {
            duration: 5000,
            panelClass: ["alert-error"]
        })
    }))

    it("manager accepts application", fakeAsync(() => {
        spyOn(appsService, "getManagerApplications").and.returnValue(Promise.resolve(appsData))
        const updateApplicationByManagerSpy = spyOn(appsService, "updateApplicationByManager").and.returnValue(Promise.resolve())

        managerAppsComp.ngOnInit()
        tick()

        expect(managerAppsComp.data).not.toBeNull()

        managerAppsComp.onDue(0, 0)
        tick()

        managerAppsFixture.detectChanges()
        flush()

        expect(updateApplicationByManagerSpy).toHaveBeenCalledOnceWith(appsData.apps[0][0], ApplicationStatus.Due)
        expect(managerAppsComp.data?.apps[0][0].status).toEqual(ApplicationStatus.Due)
    }))

    it("manager denies application", fakeAsync(() => {

        spyOn(appsService, "getManagerApplications").and.returnValue(Promise.resolve(appsData))
        const updateApplicationByManagerSpy = spyOn(appsService, "updateApplicationByManager").and.returnValue(Promise.resolve())
        managerAppsComp.ngOnInit()
        tick()

        expect(managerAppsComp.data).not.toBeNull()

        managerAppsComp.onRejected(0, 0)
        tick()

        managerAppsFixture.detectChanges()
        flush()

        expect(updateApplicationByManagerSpy).toHaveBeenCalledOnceWith(appsData.apps[0][0], ApplicationStatus.Rejected, rejectReason)
        expect(managerAppsComp.data?.apps[0][0].status).toEqual(ApplicationStatus.Rejected)
        expect(managerAppsComp.data?.apps[0][0].rejectReason).toEqual(rejectReason)
    }))

    it("explorer cancels application", fakeAsync(() => {
        spyOn(appsService, "getAppsByStatus").and.returnValues(
            Promise.resolve(appsData.apps[0]), 
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
        )
        const cancelApplicationSpy = spyOn(appsService, "cancelApplication").and.returnValue(Promise.resolve())

        const snackbarSpy = spyOn(snackbar, "open")
        
        appsExplorerListComp.ngOnInit()
        tick()
        
        expect(snackbarSpy).toHaveBeenCalledWith("Reservas obtenidas correctamente", "Cerrar", {
            duration: 5000,
            panelClass: ["alert-success"]
        })

        appsExplorerListComp.onCancel(appsData.apps[0][0])
        tick()

        expect(cancelApplicationSpy).toHaveBeenCalledOnceWith(appsData.apps[0][0])

        expect(snackbarSpy).toHaveBeenCalledWith("Reserva cancelada con éxito", "Cerrar", {
            duration: 5000,
            panelClass: ["alert-success"]
        })
    }))

    it("explorer pays application", fakeAsync(() => {
        const paypalURL = "https://paypal.com/my-payment#payment"

        spyOn(appsService, "getAppsByStatus").and.returnValues(
            Promise.resolve([dueApp]), 
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
        )
        const payApplicationSpy = spyOn(appsService, "payApplication").and.returnValue(Promise.resolve(paypalURL))
        const snackbarSpy = spyOn(snackbar, "open")
        
        appsExplorerListComp.ngOnInit()
        tick()
        
        expect(snackbarSpy).toHaveBeenCalledWith("Reservas obtenidas correctamente", "Cerrar", {
            duration: 5000,
            panelClass: ["alert-success"]
        })

        appsExplorerListComp.onPay(0)
        tick()

        expect(payApplicationSpy).toHaveBeenCalledOnceWith(dueAppID, `${environment.frontendURL}/application-payment`, `${environment.frontendURL}/application-payment`)
    }))

    it("application payment confirmation", fakeAsync(() => {
        const PayerID = "payerID"
        const paymentId = "paymentID"

        mockActivatedRoute.testParams = { paymentId, PayerID }
        const confirmApplicationPaymenySpy = spyOn(appsService, "confirmApplicationPaymen").and.returnValue(Promise.resolve())
        spyOn(actorsService, "subscribeToLoggedActor").and.callFake(cb => {
            cb(sampleActor)
            return new Subscription()
        })
        const appPaymentFixture = TestBed.createComponent(ApplicationPaymentComponent)
        const appPaymentComp = appPaymentFixture.componentInstance
        appPaymentFixture.detectChanges()
        tick()

        expect(appPaymentComp).toBeTruthy()
        expect(confirmApplicationPaymenySpy).toHaveBeenCalledOnceWith(paymentId, PayerID)
    }))
})
