import { browser, by, element, ElementFinder, Key, protractor } from "protractor"

export class TripsPage {
    private eTrip = {
        title: "titleEdit",
        description: "descriptionEdit",
        requirement: "requirementEdit",
        stageTitle: "stageTitleEdit",
        stageDescription: "stageDescriptionEdit",
        stagePrice: "100",
        picture: "https://i.ebayimg.com/images/g/d6EAAOSwfcVUCIhN/s-l500.jpg"
    }
    private trip = {
        title: "title",
        description: "description",
        requirement: "requirement",
        startDate: "8/24/2021",
        endDate: "8/31/2021",
        stageTitle: "stageTitle",
        stageDescription: "stageDescription",
        stagePrice: "0",
        picture: "https://i.ebayimg.com/images/g/T84AAOSwwSpfuZSo/s-l500.jpg"
    }
    async navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl)
    }
    async clickNewTrip(trip: any = this.trip) {
        await element(by.id("newTrip")).click();
    }

    async fillNewTrip(trip: any = this.trip) {
        await element(by.id("title")).sendKeys(trip.title);
        await element(by.id("description")).sendKeys(trip.description);
        await element(by.id("mat-date-range-input-0")).sendKeys(trip.startDate + protractor.Key.TAB + trip.endDate);
        await element(by.id("requeriment")).sendKeys(trip.requirement);
        await element(by.id("stageTitle")).sendKeys(trip.stageTitle);
        await element(by.id("stageDescription")).sendKeys(trip.stageDescription);
        await element(by.id("stagePrice")).sendKeys(trip.stagePrice);
        await element(by.id("picture")).sendKeys(trip.picture);
    }

    async clickSubmit() {
        browser.wait(protractor.ExpectedConditions.presenceOf(element(by.xpath("//button[@type='submit']"))));
        await element(by.xpath("//button[@type='submit']")).isEnabled();
        await element(by.xpath("//button[@type='submit']")).click();
    }

    async getTripToEdit() {
        var trips = element.all(by.xpath("//button[@id='edit']"))
        await trips.last().click();
    }

    async checkTripTitleIsTheCreatedOne(trip: any = this.trip) {
        var trips = element.all(by.xpath("//h3[@class='title']"))
        await expect(trips.last().getText()).toEqual(trip.title)
    }

    async checkEditTripTitleIsTheUpdatedOne(editTrip: any = this.editTrip) {
        var trips = element.all(by.xpath("//h3[@class='title']"))
        await expect(trips.last().getText()).toEqual(editTrip.title)
    }

    async editTrip(editTrip: any = this.eTrip) {
        await element(by.id("title")).clear();
        await element(by.id("title")).sendKeys(editTrip.title);
        await element(by.id("description")).clear();
        await element(by.id("description")).sendKeys(editTrip.description);
        await element(by.id("requeriment")).clear();
        await element(by.id("requeriment")).sendKeys(editTrip.requirement);
        await element(by.id("stageTitle")).clear();
        await element(by.id("stageTitle")).sendKeys(editTrip.stageTitle);
        await element(by.id("stageDescription")).clear();
        await element(by.id("stageDescription")).sendKeys(editTrip.stageDescription);
        await element(by.id("stagePrice")).clear();
        await element(by.id("stagePrice")).sendKeys(editTrip.stagePrice);
        await element(by.id("picture")).clear();
        await element(by.id("picture")).sendKeys(editTrip.picture);
    }

    async getTripDetail() {
        browser.sleep(3000)
        var trips = element.all(by.xpath("//button[@id='detail']"))
        await trips.last().click();
    }

    async checkTripDetail(editTrip: any = this.eTrip) {

        expect(element(by.xpath("//h3[@class='title']")).getText()).toContain(editTrip.title)
        expect(element(by.xpath("//mat-card//h3[2]")).getText()).toContain(editTrip.stagePrice)
        expect(element(by.id("display-description")).getText()).toContain(editTrip.description)
        expect(element(by.xpath("//mat-card[@class='mat-card mat-focus-indicator ng-star-inserted']//p")).getText()).toContain(editTrip.requirement);

        element(by.id("mat-expansion-panel-header-0")).click();

        expect(element(by.xpath("//mat-panel-title")).getText()).toEqual(editTrip.stageTitle)
        expect(element(by.xpath("//div[contains(@class,'mat-expansion-panel-body')]//p[1]")).getText()).toEqual(editTrip.stageDescription)
        expect(element(by.xpath("//div[contains(@class,'mat-expansion-panel-body')]//p[2]")).getText()).toEqual(editTrip.stagePrice)
        element(by.xpath("//div[contains(@style,'" + editTrip.picture + "')]")).isPresent();
    }

}
