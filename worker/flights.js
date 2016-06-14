'use strict'
let requestPromise = require("request-promise");
let SkyscannerKeys = require("../APIKEYS.js");
let knex = require ('../db/db');

let originCities = ["DFWA-sky", "HOUA-sky"];
let destinationCities = ["RIOA-sky", "BJSA-sky", "CUZ-sky", "AMMA-sky", "CUN-sky", "ROME-sky", "DEL-sky"];

let destinationCitiesTest = ["RIOA-sky", "BJSA-sky"];


let today = new Date;

//
//adds a given number of days to a date

Date.prototype.addDays = function(days) {
  let flightDate = new Date(this.getTime())
  flightDate.setDate(flightDate.getDate() + days);
  return flightDate;
}

//
//POST request to skyscanner to get session key

function getSessionKey(originplace, destinationplace, outbounddate, inbounddate) {
  let options = {
    method: 'POST',
    uri: 'http://partners.api.skyscanner.net/apiservices/pricing/v1.0',
    transform: (body, response, resolveWithFullResponse) => {
      return response.headers.location.split("/").slice(-1)[0];
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    form: {
      apiKey: SkyscannerKeys.SKYSCANNER_API,
      country: "US",
      currency: "USD",
      locale: "en-US",
      originplace: originplace,
      destinationplace: destinationplace,
      outbounddate: outbounddate.toISOString().slice(0,10),
      inbounddate: inbounddate.toISOString().slice(0,10)
    }
  }
  return requestPromise(options)
}

//
//GET request to skyscanner to get flight info

function pollSession(sessionKey) {
  console.log("pollSession called");
  let options = {
    method: 'GET',
    uri: 'http://partners.api.skyscanner.net/apiservices/pricing/v1.0/' + sessionKey + '?apiKey=' + SkyscannerKeys.SKYSCANNER_API,
    headers:{
      Accept: "application/json"
    }
  }
  return requestPromise(options)
}

//
//returs an object with the lowest price for a 10-day round-trip with a given departure date, and a deep link to book

function searchSkyscannerByDate(departureDate, originCity, destinationCity){
  let outboundDate = departureDate;
  let inboundDate = new Date(departureDate.getTime()).addDays(10);

  getSessionKey(originCity, destinationCity, outboundDate, inboundDate)
    .then( (sessionKey) => {
      console.log("sessionKey:", sessionKey);
      return sessionKey;
    })
    .then(pollSession)
    .then( (resp) => {
      let response = JSON.parse(resp)
      return response.Itineraries
        .map( (val) => {
          return val.PricingOptions
          .map( (ops) => {
            return  {
                      price: ops.Price,
                      originCity: originCity,
                      destinationCity: destinationCity,
                      outboundDate: outboundDate.toISOString().slice(0,10),
                      inboundDate: inboundDate.toISOString().slice(0,10),
                      outboundMonth: outboundDate.toISOString().slice(5,7),
                      outboundYear: outboundDate.toISOString().slice(0,4),
                      deepLink: ops.DeeplinkUrl
                    }
          })
        })
        .reduce( (prev, current) => {
          return prev.concat(current)
        }, [])
        .reduce( (prev, current) => {
          return prev.price < current.price ? prev : current
        }, [])
    })
    .then ( (objToInsertIntoDb) => {
      console.log(objToInsertIntoDb);
      return knex.insertQuotesIntoDb(objToInsertIntoDb)
    })
}

//
//generates an array of flight dates for the next year

function generateFlightDates(daysOut){
  let dates = [];
  let daysAdded = daysOut;
  let count = 0;
  //change back to < 52
  while(count < 1){
    dates.push(today.addDays(daysAdded));
    daysAdded += 7;
    count++;
  }
  return dates;
}


//
// Insert flight object into quotes table

knex.insertQuotesIntoDb = function(flightObj) {
  return knex('quotes').insert(flightObj);
}

//
//generates all data that is collected and inserted into Db

function gatherDataAndInsertIntoDb() {  
  let departureDates = generateFlightDates(14);
  originCities.forEach( (city) => {
    //change back from test
    destinationCitiesTest.forEach( (dest) => {
      departureDates.forEach( (date) => {
        // console.log(date, city, dest)
        return searchSkyscannerByDate(date, city, dest)
      })     
    })
  })
}


// gatherDataAndInsertIntoDb()

function insertThenCloseDb () {
  gatherDataAndInsertIntoDb();
  setTimeout(knex.closeDb, 30000);
}

insertThenCloseDb()












