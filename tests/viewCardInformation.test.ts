import { expect, test } from '@playwright/test';
import { Login } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

test('View Card Information', async ({ page, context }) => {
    const loginPage = new Login(page, context);
    const inventoryPage = new InventoryPage(page, context);

    await test.step('Navigate to application', async () => {
        expect(await loginPage.navigateToURL()).toBeTruthy();
    });

    await test.step('Perform login', async () => {
        expect(await loginPage.login()).toBeTruthy();
    });

    await test.step('View Product Details', async () => {
        expect(await inventoryPage.viewProductDetails()).toBeTruthy();
    });

    await test.step('Logout', async () => {
        expect(await loginPage.logout()).toBeTruthy();
    });
});