import { expect, test } from '@playwright/test';
import { Login } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';

test('Checkout', async ({ page, context }) => {
    const loginPage = new Login(page, context);
    const inventoryPage = new InventoryPage(page, context);
    const cartPage = new CartPage(page, context);
    const checkoutPage = new CheckoutPage(page, context);

    await test.step('Navigate to application', async () => {
        expect(await loginPage.navigateToURL()).toBeTruthy();
    });

    await test.step('Perform login', async () => {
        expect(await loginPage.login()).toBeTruthy();
    });

    await test.step('Add first item to cart', async () => {
        expect(await inventoryPage.addFirstItemToCart()).toBeTruthy();
    });

    await test.step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
    });

    await test.step('Navigate to checkout page', async () => {
        await cartPage.navigateToCheckoutPage();
    });
    await test.step('Fill your information', async () => {
        await checkoutPage.fillYourInformation();
    });

    await test.step('Review order', async () => {
        await checkoutPage.reviewOrder();
    }); 
    await test.step('Complete checkout', async () => {
        await checkoutPage.completeCheckout();
    });

    await test.step('Logout', async () => {
        expect(await loginPage.logout()).toBeTruthy();
    });
});