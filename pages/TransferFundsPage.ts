import { Locator, Page, expect } from '@playwright/test';

export class TransferFundsPage {
    readonly transferFundsLink: Locator;
    readonly amountInput: Locator;
    readonly fromAccountId: Locator;
    readonly toAccountSelect: Locator;
    readonly transferButton: Locator;
    readonly transferCompleteHeading: Locator;
    readonly transferSuccessMessage: Locator;

    constructor(page: Page) {
        this.transferFundsLink = page.locator('#leftPanel').getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('#amount');
        this.fromAccountId = page.locator('#fromAccountId');
        this.toAccountSelect = page.locator('#toAccountId');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
        this.transferSuccessMessage = page.getByText(/has been transferred from account/);
    }

    async goTo() {
        await this.transferFundsLink.click();
    }

    async fillTransferDetails(amount: string, toAccountId: string) {
        await this.amountInput.fill(amount);
        await this.fromAccountId.selectOption({ index: 0 });
        await this.toAccountSelect.selectOption(toAccountId);
    }

    async submitTransfer() {
        await this.transferButton.click({ timeout: 5000 });
    }

    async getFromAccountId() {
        await this.fromAccountId.waitFor();
        return await this.fromAccountId.locator('option:checked').textContent();
    }

    async verifyTransferSuccess(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.transferCompleteHeading).toBeVisible();
        await expect(this.transferSuccessMessage).toContainText(`$${amount}.00 has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
    }
}
