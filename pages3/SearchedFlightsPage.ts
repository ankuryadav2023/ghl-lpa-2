import {Page} from '@playwright/test'

export class SearchedFlightsPage{
    page: Page;
    bookButtonsLocator: string="//button[@ng-click='SelectedFlight_L(s,segID)']";

    constructor(page: Page){
        this.page=page;
    }

    async bookCheapestFlight(){
        await this.page.locator("//div[contains(@class, 'chepestbt')]").click();
        await this.page.waitForTimeout(1000);
        await this.page.locator(this.bookButtonsLocator).nth(0).click()
    }
}