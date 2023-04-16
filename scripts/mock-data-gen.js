import fs from "fs"
import {uuid} from "uuidv4"
import random from 'random';
import moment from 'moment';

const fileContents = JSON.parse(fs.readFileSync("scripts/mock-data.json"));

function getLocations(location) {
let locationObj = {};
locationObj["id"] = uuid();
locationObj["city"] = location;
if (location == "Meereen") {
locationObj["country"] = "Essos";
} else {
locationObj["country"] = "Westeros";
}
return locationObj;
}

function generateDates(year) {
function timeDelta(year) {
if ((year + 1723) % 4 == 0) {
return random.int(1, 366);
} else {
return random.int(1, 355);
}
}
let date = moment([year + 1723, 0, 1]);
let offset = moment.duration(timeDelta(year), "days");
return date.add(offset).format();
}

function getPersons(person, locations) {
let personObj = {};
personObj["id"] = uuid();
personObj["firstName"] = person["firstName"];
personObj["lastName"] = person["lastName"];
personObj["gender"] = person["gender"];
personObj["dob"] = person["dob"];
if (person["dod"]) {
personObj["dod"] = person["dod"];
}
for (let location of locations) {
if (person["place"] == location["city"]) {
personObj["placeId"] = location["id"];
}
if (person["placeOfBirth"] == location["city"]) {
personObj["pobId"] = location["id"];
}
}
return personObj;
}

function getMarriage(person1, person2) {
let marriageObj = {};
// marriageObj["id"] = uuid();
marriageObj["partner1Id"] = person1;
marriageObj["partner2Id"] = person2;
return marriageObj;
}

function getParents(id1, id2, gender2) {
let parentsObj = {};
parentsObj["childId"] = id1;
parentsObj["parent1Id"] = id2;
if (gender2 == "female") {
parentsObj["parent1relation"] = "mother";
} else if (gender2 == "male") {
parentsObj["parent1relation"] = "father";
}
return parentsObj;
}

export let parents = [];
export let spouses = [];
export let persons = [];
let personCheck = [];
export let locations = [];
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
if (!personCheck.includes(entry["firstName"] + entry["lastName"])) {
persons.push(getPersons(entry, locations));
personCheck.push(entry["firstName"] + entry["lastName"]);
}
}
let id1, id2 = null
// Does not check for duplication
for (let person1 of fileContents) {
    let spouses1 = person1["spouses"].split(",");
    let parents1 = person1["parents"].split(",");
    for (let person2 of fileContents) {
    for (let person of persons) {
    if (`${person1['firstName']}${person1['lastName']}` == `${person['firstName']}${person['lastName']}`) {
    id1 = person["id"];
    }
    if (`${person2['firstName']}${person2['lastName']}` == `${person['firstName']}${person['lastName']}`) {
    id2 = person["id"];
    }
    }
    if (spouses1.includes(`${person2['firstName']} ${person2['lastName']}`) && id1 != null && id2 != null) {
    spouses.push(getMarriage(id1, id2));
    }
    if (parents1.includes(`${person2['firstName']} ${person2['lastName']}`) && id1 != null && id2 != null) {
    parents.push(getParents(id1, id2, person2["gender"]));
    }
    }
    }


