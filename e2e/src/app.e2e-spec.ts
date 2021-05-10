import { browser, by, element, logging } from "protractor";
import { AppPage } from "./app.po";
let url ="http://localhost:4200/";

describe("workspace-project App", () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it("should display welcome message", async () => {
        await page.navigateTo();
        //expect(await page.getTitleText()).toEqual("acme-frontend app is running!");
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});

describe('As an user I log in', function() {
    it('As an explorer I log in', function() {
      browser.get(url);

      element(by.xpath('//button[@ng-reflect-router-link="/register"]')).click();
      element(by.xpath('//input[@formcontrolname="name"]')).sendKeys('NameTest');
      element(by.xpath('//input[@formcontrolname="surname"]')).sendKeys('SurnamesTest');
      element(by.xpath('//input[@formcontrolname="email"]')).sendKeys('EmailTest');
      element(by.xpath('//input[@formcontrolname="password"]')).sendKeys('mypass');
      element(by.xpath('//input[@formcontrolname="repeatPassword"]')).sendKeys('mypass');
      element(by.xpath('//button[@type="submit"]')).click;
    });
  });
