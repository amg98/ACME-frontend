import { browser, by, element } from "protractor"

export class LoginPage {
    private manager = {
        email: "manager@manager.com",
        pass: "manager"

    }
    async navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl)
    }
    async clickOnLoginButton() {
        await element(by.xpath("//button[@routerlink='/login']")).click();
    }

    async fillCredentials(manager: any = this.manager) {
        await element(by.xpath("//input[@type='email']")).sendKeys(manager.email);
        await element(by.xpath("//input[@type='password']")).sendKeys(manager.pass);
        await element(by.xpath("//button[@type='submit']")).click();

    }
}
