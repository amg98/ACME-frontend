import { browser, by, element, logging } from "protractor";
import { AppPage } from "./app.po";
const url ="http://localhost:4200/";

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

