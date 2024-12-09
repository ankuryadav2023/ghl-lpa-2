import { Page } from "@playwright/test";
import { datenPriceType } from "../types";

export class FlightsPage{
    page: Page;
    fromCityLocator1: string="//input[@id='FromSector_show']";
    fromCityLocator2: string="//input[@id='a_FromSector_show']";
    fromCityLocator3: string="//div[@class='mflexcol']";
    toCityLocator1: string="//input[@id='a_Editbox13_show']";
    toCityLocator2: string="//li[@onchange='ChangeCabin();']";
    datenPriceLisLocator: string="//li[contains(@id, '12/2024') and not(contains(@class,'old-dt'))]";
    datenPriceArray: datenPriceType[]=[];
    searchFlightsButtonLocator: string="//button[@onclick='SearchFlightWithArmyTest();']";

    constructor(page: Page){
        this.page=page;
    }

    async fillFromCity(fromCityName: string){
        await this.page.locator(this.fromCityLocator1).click();
        await this.page.locator(this.fromCityLocator2).type(fromCityName, {delay: 100});
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.fromCityLocator3).nth(0).click();
        await this.page.waitForTimeout(1000);
    }
    
    async fillToCity(toCityName: string){
        await this.page.locator(this.toCityLocator1).type(toCityName, {delay: 100});
        await this.page.waitForTimeout(2000);
        const airportLisArray=await this.page.locator(this.toCityLocator2).all();
        for(let i=0;i<airportLisArray.length;i++){
            if(await airportLisArray[i].isVisible()){
                await airportLisArray[i].click();
                break;
            }
        }
        await this.page.waitForTimeout(1000);
    }

    async selectLowestPriceTicketInDec(){
        const datenPriceLis=await this.page.locator(this.datenPriceLisLocator).all();
        for(let i=0;i<datenPriceLis.length;i++){
            let date=await datenPriceLis[i].textContent();
            let ticket_price_temp=await datenPriceLis[i].locator("//span").textContent();
            let ticket_price=ticket_price_temp?.split(' ')[1];
            this.datenPriceArray.push({date: Number(date), ticket_price: Number(ticket_price), element: datenPriceLis[i]});
        }
        let ticketPriceArray=this.datenPriceArray.map(datenPrice=>datenPrice.ticket_price);
        let lowestTicketPrice=Math.min(...ticketPriceArray);
        console.log(lowestTicketPrice);
        let lowestTicketPricenNearestDate=this.datenPriceArray.find(datenPrice=>{
            return datenPrice.ticket_price===lowestTicketPrice;
        });
        await lowestTicketPricenNearestDate?.element.click();
        await this.page.waitForTimeout(1000);
    }

    async clickSearchFlightsButton(){
        await this.page.locator(this.searchFlightsButtonLocator).click();
    }
}
