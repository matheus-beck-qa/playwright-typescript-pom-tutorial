import { test } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

let newAccountId;
let fromAccountId;

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});

test('Opens a new banking account', async ({ page }) => {
  const accountPage = new OpenNewAccountPage(page);
  await accountPage.goTo();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');
  await accountPage.submitAccountForm();
  newAccountId = await accountPage.getNewAccountId();
  await accountPage.verifyAccountCreation(newAccountId);
});

test('Transfer funds between own banking accounts', async ({ page }) => {
  test.skip(newAccountId === null || newAccountId === undefined, 'Skipping test because newAccountId is not set');
  const transferPage = new TransferFundsPage(page);
  await transferPage.goTo();
  let transferAmout = '100';
  fromAccountId = await transferPage.getFromAccountId();
  await transferPage.fillTransferDetails(transferAmout, newAccountId);
  await page.waitForLoadState('networkidle');
  await transferPage.submitTransfer();
  await transferPage.verifyTransferSuccess(transferAmout, fromAccountId, newAccountId);
});