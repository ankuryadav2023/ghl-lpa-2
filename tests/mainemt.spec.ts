import {test, expect, Page} from "@playwright/test";
import { FlightsPage } from "../pages3/FlightsPage";
import { SearchedFlightsPage } from "../pages3/SearchedFlightsPage";
import { FlightDetailsPage } from "../pages3/FlightDetailsPage";

test.describe("makemytrip.com Flight Booking Automation", async ()=>{
    let page: Page;
    let fromCityName: string="Jaipur";
    let toCityName: string="Delhi";
    let invalidCouponCode: string="ABCD";
    let validCouponCode: string="EMTNCF";

    test.beforeAll(async ({browser})=>{
        const context=await browser.newContext();
        page=await context.newPage();
        await page.goto("https://www.easemytrip.com");
    });

    test("Book Flight with Lowest Ticket Price and Nearest Date", async ()=>{
        let flightsPageObj=new FlightsPage(page);
        await flightsPageObj.fillFromCity(fromCityName);
        await flightsPageObj.fillToCity(toCityName);
        await flightsPageObj.selectLowestPriceTicketInDec();
        await flightsPageObj.clickSearchFlightsButton();
        let searchFlightsPageObj=new SearchedFlightsPage(page);
        await searchFlightsPageObj.bookCheapestFlight();
    });
    test("Validating Fair",async ()=>{
        let flightDetailsPageObj=new FlightDetailsPage(page);
        await flightDetailsPageObj.validateFair();
    });
    test("Validating Coupon Code",async ()=>{
        let flightDetailsPageObj=new FlightDetailsPage(page);
        await flightDetailsPageObj.validateCoupon(invalidCouponCode, validCouponCode);
    });
});