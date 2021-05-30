import { LoginPage } from "../login/login.po";
import { browser, by, element } from "protractor";
import { TripsPage } from "./trips.po"

browser.manage().timeouts().implicitlyWait(10000);


describe("Create and edit a trip by a manager", () => {
    let trip: TripsPage;
    let login: LoginPage;

    beforeEach(() => {
        login = new LoginPage;
        trip = new TripsPage;
    })
    it("should create a trip and edit it", async () => {

        await login.navigateTo();
        await login.clickOnLoginButton();
        await login.fillCredentials();

        await trip.clickNewTrip();
        await trip.fillNewTrip();
        await trip.clickSubmit();
        await trip.checkTripTitleIsTheCreatedOne();

        await trip.getTripToEdit();
        await trip.editTrip();
        await trip.clickSubmit();

        await browser.sleep(3000);

        await trip.navigateTo();
        await trip.getTripDetail();

        await trip.checkTripDetail();

    })

})