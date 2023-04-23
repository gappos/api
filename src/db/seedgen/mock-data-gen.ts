// @ts-nocheck
import fs from "fs"
import { v4 } from "uuid"
import moment from 'moment';

import fileContents from "./mock-data.json"

function getLocations(location) {
    let locationObj = {};
    locationObj["id"] = v4();
    locationObj["city"] = location;
    if (location == "Meereen") {
        locationObj["country"] = "Essos";
    } else {
        locationObj["country"] = "Westeros";
    }
    return locationObj;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function addYears(date, years) {
    const getYear = new Date(date).getFullYear();
    const newDate = new Date(date).setFullYear(getYear + years)
    return new Date(newDate);
}

function generateDates(year) {
    function timeDelta(year) {
        if ((year + 1723) % 4 == 0) {
            return randomInt(1, 366);
        } else {
            return randomInt(1, 355);
        }
    }
    let date = moment([year + 1723, 0, 1]);
    let offset = moment.duration(timeDelta(year), "days");
    return date.add(offset).format();
}

function getPersons(person, locations) {
    let personObj = {};
    personObj["id"] = v4();
    personObj["first_name"] = person["first_name"];
    personObj["last_name"] = person["last_name"];
    personObj["gender"] = person["gender"];
    personObj["dob"] = person["dob"];
    if (person["dod"]) {
        personObj["dod"] = person["dod"];
    }
    for (let location of locations) {
        if (person["place"] == location["city"]) {
            personObj["place_id"] = location["id"];
        }
        if (person["placeOfBirth"] == location["city"]) {
            personObj["pob_id"] = location["id"];
        }
    }
    return personObj;
}

function getMarriage(person1, person2, dob1, dob2) {
    let marriageObj = {};
    marriageObj["partner1_id"] = person1;
    marriageObj["partner2_id"] = person2;
    let weddingDate
    (dob1.valueOf() < dob2.valueOf()) ? weddingDate = addYears(dob1, 10) : weddingDate = addYears(dob2, 10)
    marriageObj["wedding"] = weddingDate
    return marriageObj;
}

function getParents(id1, id2, gender2) {
    let parentsObj = {};
    parentsObj["child_id"] = id1;
    parentsObj["parent_id"] = id2;
    if (gender2 == "female") {
        parentsObj["relation"] = "mother";
    } else if (gender2 == "male") {
        parentsObj["relation"] = "father";
    }
    return parentsObj;
}

let parents = [];
let spouses = [];
let persons = [];
let personCheck = [];
let locations = [];
let locationCheck = [];
let dates = [];
for (let entry of fileContents) {
    // LOCATION
    if (!locationCheck.includes(entry["place"])) {
        locations.push(getLocations(entry["place"]));
        locationCheck.push(entry["place"]);
    }
    if (!locationCheck.includes(entry["placeOfBirth"])) {
        locations.push(getLocations(entry["placeOfBirth"]));
        locationCheck.push(entry["placeOfBirth"]);
    }

    // DATES
    entry["dob"] = generateDates(entry["dob"]);
    if (entry["dod"]) {
        entry["dod"] = generateDates(entry["dod"]);
    }

    // PERSON
    if (!personCheck.includes(entry["first_name"] + entry["last_name"])) {
        persons.push(getPersons(entry, locations));
        personCheck.push(entry["first_name"] + entry["last_name"]);
    }
}
let id1, id2 = null
// Does not check for duplication
for (let person1 of fileContents) {
    let spouses1 = person1["spouses"].split(",");
    let parents1 = person1["parents"].split(",");
    for (let person2 of fileContents) {
        for (let person of persons) {
            if (`${person1['first_name']}${person1['last_name']}` == `${person['first_name']}${person['last_name']}`) {
                id1 = person["id"];
            }
            if (`${person2['first_name']}${person2['last_name']}` == `${person['first_name']}${person['last_name']}`) {
                id2 = person["id"];
            }
        }
        if (spouses1.includes(`${person2['first_name']} ${person2['last_name']}`) && id1 != null && id2 != null) {
            spouses.push(getMarriage(id1, id2, person1["dob"], person2["dob"]));
        }
        if (parents1.includes(`${person2['first_name']} ${person2['last_name']}`) && id1 != null && id2 != null) {
            parents.push(getParents(id1, id2, person2["gender"]));
        }
    }
}

const data = {
    parents,
    locations,
    persons,
    spouses,
}

export default data
