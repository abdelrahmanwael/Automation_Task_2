import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

export class CartPage {
    page: Page
    readonly checkoutBtn: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.checkoutBtn = this.page.locator('//button[@id="checkout"]');
        this.productName = this.page.locator('//div[@class="inventory_item_name"]');
        this.productPrice = this.page.locator('//div[@class="inventory_item_price"]');


    }

    async navigateToCheckoutPage(): Promise<void> {
        await this.checkoutBtn.click();
    }
    async reviewProductsAddedToCart(): Promise<boolean> {
        // Wait for order items to be visible
        await expect(this.productName.first()).toBeVisible({ timeout: 5000 });

        // Read saved product info
        const filePath = path.join(__dirname, '..', 'testData', 'productInfo.json');
        let saved: { products: { name: string; price: string }[] };
        try {
            const content = await fs.readFile(filePath, 'utf8');
            saved = JSON.parse(content);
        } catch (err) {
            throw new Error(`Failed to read productInfo.json: ${err}`);
        }

        const products = saved.products ?? [];
        // Ensure we have expected count on the UI
        const uiCount = await this.productName.count();
        if (uiCount < products.length) {
            throw new Error(`Expected at least ${products.length} products in UI, found ${uiCount}`);
        }

        // Compare each saved product with UI values (by index)
        for (let i = 0; i < products.length; i++) {
            const uiName = (await this.productName.nth(i).textContent())?.trim() ?? '';
            const uiPrice = (await this.productPrice.nth(i).textContent())?.trim() ?? '';
            expect(uiName).toBe(products[i].name);
            expect(uiPrice).toBe(products[i].price);
        }

        return true;
    }


}