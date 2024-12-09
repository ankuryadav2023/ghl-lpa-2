import {Page, expect} from '@playwright/test'

export class FlightDetailsPage{
    page: Page;
    bscFairLocator: string= "//span[@ng-bind='CurrencyDisplayRate(pf.BscFare)']";
    taxFairLocator: string="//span[@ng-bind='CurrencyDisplayRate(TtlDisplayTax)']";
    totalFairLocator: string="//span[@id='spnGrndTotal']";
    clearCouponDivLocator: string="//div[@ng-click='RemoveCoupone()']";
    couponInputLocator: string="//input[@id='txtCouponCode']";
    applyCouponDivLocator: string="//div[@ng-click='ApplyCouponCode()']";
    couponMessageParaLocator: string="//p[@ng-bind='CouponMsg']";
    expectedInvalidCouponMessage: string="Invalid Coupon";
    expectedValidCouponMessage: string="Congratulations! Zero Convenience Coupon has been applied successfully. You have saved Rs.350 per passenger per sector as convenience fees."
    constructor(page: Page){
        this.page=page;
    }

    async validateFair(){
        let bscFair=await this.page.locator(this.bscFairLocator).textContent();
        let taxFair=await this.page.locator(this.taxFairLocator).textContent();
        let totalFairTemp=await this.page.locator(this.totalFairLocator).textContent();
        let calculatedTotalFair=Number(bscFair?.trim())+Number(taxFair?.trim());
        let totalFair='';
        if(totalFairTemp){
            for(let i=0;i<totalFairTemp.length;i++){
                if(totalFairTemp[i]===',') continue;
                else totalFair+=totalFairTemp[i];
            }
        }
        console.log(totalFair);
        expect(calculatedTotalFair).toEqual(Number(totalFair));
    }

    async validateCoupon(invalidCouponCode: string, validCouponCode: string){
        await this.page.locator(this.clearCouponDivLocator).click();
        await this.page.locator(this.couponInputLocator).type(invalidCouponCode, {delay: 100});
        await this.page.locator(this.applyCouponDivLocator).click();
        await this.page.waitForTimeout(1000);
        let invalidCouponMessage=await this.page.locator(this.couponMessageParaLocator).textContent();
        expect(invalidCouponMessage).toEqual(this.expectedInvalidCouponMessage);
        await this.page.locator(this.couponInputLocator).type(validCouponCode, {delay: 100});
        await this.page.locator(this.applyCouponDivLocator).click();
        await this.page.waitForTimeout(1000);
        let validCouponMessage=await this.page.locator(this.couponMessageParaLocator).textContent();
        expect(validCouponMessage).toEqual(this.expectedValidCouponMessage);
    }
}