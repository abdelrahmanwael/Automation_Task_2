import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import checkoutInfo from '../testData/checkoutInfo.json';
import { promises as fs } from 'fs';
import path from 'path';

export class CheckoutPage {
    page: Page
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly postalCodeField: Locator;
    readonly continueBtn: Locator;
    readonly finishBtn: Locator;
    readonly successMsg: Locator;
    readonly backHomeBtn: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;




    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        //your information step locators
        this.firstNameField = this.page.locator('//input[@id="first-name"]');
        this.lastNameField = this.page.locator('//input[@id="last-name"]');
        this.postalCodeField = this.page.locator('//input[@id="postal-code"]');
        this.continueBtn = this.page.locator('//input[@id="continue"]');
        this.productName = this.page.locator('//div[@class="inventory_item_name"]');
        this.productPrice = this.page.locator('//div[@class="inventory_item_price"]');
        this.finishBtn = this.page.locator('//button[@id="finish"]');
        this.successMsg = this.page.locator('//h2[@data-test="complete-header"]');
        this.backHomeBtn = this.page.locator('//button[@id="back-to-products"]');
        
        
    }
    
    async fillYourInformation(): Promise<void> {
        await this.firstNameField.fill(checkoutInfo.firstName);
        await this.lastNameField.fill(checkoutInfo.secondName);       
        await this.postalCodeField.fill(checkoutInfo.postalCode);
        await this.continueBtn.click();
    }
    async reviewOrder(): Promise<boolean> {
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
    async completeCheckout(): Promise<void> {
        await this.finishBtn.click();
        await expect(this.successMsg).toHaveText("Thank you for your order!");
        await this.backHomeBtn.click();
    }

    
    
    
}