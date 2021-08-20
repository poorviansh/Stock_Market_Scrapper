const puppeteer = require("puppeteer");
let tab;


//created an async function 

(async function(){
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });


//a global tab to get links and currect stock rate

    let StockDetail = await browser.pages();
    tab = StockDetail[0];
    await tab.setDefaultNavigationTimeout(0); 

    await tab.goto("https://economictimes.indiatimes.com/indices/sensex_30_companies?from=mdr");

    console.log("reached the main page");

//working for 1D .default-periods li


//getting data for 1 day 

    await tab.waitForSelector(".default-periods li");
    let newClick = tab.$(".default-periods li");
    (await newClick).click();

    console.log("Clicked for 1D");
//now getting today's data #todaysData

//getting today's stock rate 

    let TodayData = await tab.$("#todaysData span");
    let determine = await tab.evaluate(function(elem){
        return document.querySelector("b#todaysData").innerText;
    }, TodayData);
    
    console.log("--------------------------Today's Stock Data----------------------------");
    console.log("Stock's current scenario is - " + determine);
    
    //flag iBlock spriteMkt


//getting link of all company's share data in an array

    let getDataLink = [] 
    await tab.waitForSelector(".flt.w120 a", {visible: true});
    let HighStock = await tab.$$(".flt.w120 a");
    for(let i = 0; i<HighStock.length; i++){
    let createLink = await tab.evaluate( function(elem){ return elem.getAttribute("href");  }  ,  HighStock[i]);
    createLink = 'https://economictimes.indiatimes.com'+createLink;
    getDataLink.push(createLink);
    
    }
    // console.log(getDataLink);


//calling a function which will open a seperate tab for each company to get their share price

    for(let i = 0; i<getDataLink.length; i++){
       await ClickCompany(browser, getDataLink[i])
    }
})();


//created async function for getting share price for each company

async function ClickCompany(browser, getLink){
    let newTab = await browser.newPage();
    await newTab.setDefaultNavigationTimeout(0); 
    await newTab.goto(getLink);

    await newTab.waitForSelector('.col .table_wrapper' , {visible:true});


//getting name of the comapny on the console for specification

    let CompName = await newTab.$("#seoWidget .s_container .col .sub_heading");
    let determine3 = await newTab.evaluate(function(elem){
         return document.querySelector('#seoWidget .s_container .col .sub_heading').innerText;
    }, CompName);


//getting the previous and the current share price of each company for easy comparison

    let TodaySharePrice = await newTab.$(".col .table_wrapper");
    let determine2 = await newTab.evaluate(function(elem){
         return document.querySelector('.col .table_wrapper').innerText;
    }, TodaySharePrice);

    //#seoWidget .s_container .col .sub_heading


//finally printing the data scraped
    console.log("-----------------------------------------------------------");
    console.log(determine3);
    
    console.log(determine2);
    
    newTab.close();
}