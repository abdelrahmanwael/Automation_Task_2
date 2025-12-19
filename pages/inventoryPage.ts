import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';


export class InventoryPage {
    page: Page
    readonly addToCartBtn: Locator;
    readonly removeFromCartBtn: Locator;
    readonly shoppingCartLink: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly backToProductsBtn: Locator;
    readonly shoppingCartCount: Locator;



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.addToCartBtn = this.page.locator('//button[@class="btn btn_primary btn_small btn_inventory "]');
        this.removeFromCartBtn = this.page.locator('//button[@class="btn btn_secondary btn_small btn_inventory "]');
        this.shoppingCartLink = this.page.locator('//a[@class="shopping_cart_link"]');
        this.productName = this.page.locator('//div[@class="inventory_item_name "]');
        this.productPrice = this.page.locator('//div[@class="inventory_item_price"]');
        this.backToProductsBtn = this.page.locator('//button[@id="back-to-products"]');
        this.shoppingCartCount = this.page.locator('//span[@class="shopping_cart_badge"]');


    }

    async addFirstItemToCart(): Promise<boolean> {
        await this.addToCartBtn.nth(0).click();
        await this.saveProductsInfoToFile(0);
        const shoppingCartCount = await this.shoppingCartCount.textContent();
        if (shoppingCartCount == '1') {
            return true;
        }
        else
            return false;
    }
    async addSecondItemToCart(): Promise<boolean> {
        await this.addToCartBtn.nth(1).click();
        const shoppingCartCount = await this.shoppingCartCount.textContent();
        if (shoppingCartCount == '2') {
            return true;
        }
        else
            return false;
    }
    async removeFirstItemFromCart(): Promise<boolean> {
        await this.removeFromCartBtn.nth(0).click();
        return await this.addToCartBtn.nth(0).isVisible({ timeout: 5000 });
    }
    async navigateToCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }
    async viewProductDetails(): Promise<boolean> {
        await this.productName.nth(0).click();
        return await this.backToProductsBtn.isVisible({ timeout: 5000 });
    }

    async saveProductsInfoToFile(indices: number | number[]): Promise<boolean> {
        const idxs = Array.isArray(indices) ? indices : [indices];
        // Ensure product elements are present
        await expect(this.productName.first()).toBeVisible({ timeout: 5000 });

        // Read existing products if file exists
        const filePath = path.join(__dirname, '..', 'testData', 'productInfo.json');
        let existing: { products: { name: string; price: string }[] } = { products: [] };
        try {
            const content = await fs.readFile(filePath, 'utf8');
            existing = JSON.parse(content);
        } catch {
            existing = { products: [] };
        }

        for (const i of idxs) {
            const name = (await this.productName.nth(i).textContent())?.trim() ?? '';
            const price = (await this.productPrice.nth(i).textContent())?.trim() ?? '';
            // avoid duplicates by name+price
            if (!existing.products.some(p => p.name === name && p.price === price)) {
                existing.products.push({ name, price });
            }
        }

        await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
        return true;
    }

}