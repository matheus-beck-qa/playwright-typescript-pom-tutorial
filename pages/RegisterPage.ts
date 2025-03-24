import { Locator, Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly ssnInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly repeatedPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly userAlreadyExistError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#customer\\.firstName');
        this.lastNameInput = page.locator('#customer\\.lastName');
        this.streetInput = page.locator('#customer\\.address\\.street');
        this.cityInput = page.locator('#customer\\.address\\.city');
        this.stateInput = page.locator('#customer\\.address\\.state');
        this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
        this.phoneNumberInput = page.locator('#customer\\.phoneNumber');
        this.ssnInput = page.locator('#customer\\.ssn');
        this.usernameInput = page.locator('#customer\\.username');
        this.passwordInput = page.locator('#customer\\.password');
        this.repeatedPasswordInput = page.locator('#repeatedPassword');
        this.registerButton = page.getByRole("button", { name: "Register" });
        this.userAlreadyExistError = page.locator('#customer\\.username\\.errors');
    }

    async goTo() {
        await this.page.goto("https://parabank.parasoft.com/parabank/register.htm");
    }

    async fillForm() {
        await this.firstNameInput.fill(faker.person.firstName());
        await this.lastNameInput.fill(faker.person.lastName());
        await this.streetInput.fill(faker.location.streetAddress());
        await this.cityInput.fill(faker.location.city());
        await this.stateInput.fill(faker.location.state());
        await this.zipCodeInput.fill(faker.location.zipCode());
        await this.phoneNumberInput.fill(faker.phone.number());
        await this.ssnInput.fill(faker.string.numeric(9));
    }

    async fillCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.repeatedPasswordInput.fill(password);
    }

    async submitForm() {
        await this.registerButton.click();
    }

    async isErrorVisible() {
        return await this.userAlreadyExistError.isVisible();
    }

    async verifyAccountCreation(username: string) {
        const headerText = await this.page.locator("h1").textContent();
        const rightPanelText = await this.page.locator("#rightPanel").textContent();
    
        if (headerText && rightPanelText) {
          await expect(headerText.includes(`Welcome ${username}`)).toBe(true);
          await expect(rightPanelText.includes("Your account was created successfully. You are now logged in.")).toBe(true);
        } else {
          throw new Error('Expected text content was not found.');
        }
      }
}
