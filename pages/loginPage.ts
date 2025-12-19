import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import login from '../testData/login.json';


export class Login {
    page: Page
    readonly loginLink: Locator;
    readonly usernameField: Locator
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly burgerMenuButton: Locator;
    readonly logoutButton: Locator;



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.loginLink = this.page.locator('//a[@id="link"]');
        this.usernameField = this.page.locator('//input[@id="user-name"]');
        this.passwordField = this.page.locator('//input[@id="password"]');
        this.loginButton = this.page.locator('//input[@id="login-button"]');
        this.burgerMenuButton = this.page.locator('//button[@id="react-burger-menu-btn"]');
        this.logoutButton = this.page.locator('//a[@id="logout_sidebar_link"]');
        
    }
    async navigateToURL(): Promise<boolean> {
        await this.page.goto("https://www.saucedemo.com/");
        // Wait for username field to be visible as a signal the page loaded
        return await this.usernameField.isVisible({ timeout: 5000 });
    }
    async login(): Promise<boolean> {

        // Ensure fields are ready before interacting
        await expect(this.usernameField).toBeVisible({ timeout: 5000 });
        await expect(this.passwordField).toBeVisible({ timeout: 5000 });

        await this.usernameField.fill(login.username);
        await this.passwordField.fill(login.password);

        await this.loginButton.click();
        return await this.burgerMenuButton.isVisible({ timeout: 5000 });
    }
    async logout(): Promise<boolean> {
        await this.burgerMenuButton.click();
        await this.logoutButton.click();
        return await this.usernameField.isVisible({ timeout: 5000 });
    }
    
}