import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing"
import { TokenInterceptor } from "./token.interceptor"
import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http"
import { TripsService } from "@services/trips.service"

describe("AuthHttpInterceptor", () => {
    let httpMock: HttpTestingController
    let httpClient: HttpClient

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpClient,
                TripsService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                    multi: true,
                },
            ],
        })

        httpMock = TestBed.inject(HttpTestingController)
        httpClient = TestBed.inject(HttpClient)
    })

    it("should add an Authorization header", fakeAsync(() => {

        const idToken = "12345"
        const url = "https://my-backend.com"
        spyOn(localStorage, "getItem").and.callFake(() => idToken)

        httpClient.get(url).subscribe(value => {
            expect(value).toBeTruthy()
        })
        tick()
        const httpRequest = httpMock.expectOne(url)

        expect(httpRequest.request.headers.has("Authorization")).toEqual(true)
        expect(httpRequest.request.headers.get("Authorization")).toBe(`Bearer ${idToken}`)
    }))

    it("should not add an Authorization header", fakeAsync(() => {

        const url = "https://my-backend.com"
        spyOn(localStorage, "getItem").and.callFake(() => null)

        httpClient.get(url).subscribe(value => {
            expect(value).toBeTruthy()
        })
        tick()
        const httpRequest = httpMock.expectOne(url)

        expect(httpRequest.request.headers.has("Authorization")).not.toEqual(true)
    }))
})
