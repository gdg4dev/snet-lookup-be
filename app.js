const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')
const app = express();

app.use(cors())
const PORT = process.env.PORT || 3333;

function formatFullName(fullName) {
    return fullName.trim().replace(/\s+/g, '-');
}

function isEmptyObject(obj) {
    return Object.values(obj).every(val => val === undefined || val === '');
}

function extractAgeAndBirthday(ageString) {
    if (!ageString) {
        return { age: undefined, birthday: undefined };
    }
    
    const birthdayMatch = ageString.match(/Born (\w+ \d{4})/);
    const ageMatch = ageString.match(/\((\d{1,3}) years old\)/);

    const birthday = birthdayMatch ? birthdayMatch[1] : undefined;
    const age = ageMatch ? ageMatch[1] : undefined;

    return { age, birthday };
}

function scrapeRows($, results) {
    let rowIndex = 0;
    while ($(`#r${rowIndex}`).length) {
        const name = $(`#r${rowIndex} > div > div.heading > div.name`).text().trim() || undefined;
        const street = $(`#r${rowIndex} > div > div.fields > div:nth-child(1) > div > div > div.location > span > a > span.street`).text().trim() || undefined;
        const city = $(`#r${rowIndex} > div > div.fields > div:nth-child(1) > div > div > div.location > span > a > span.city`).text().trim() || undefined;
        const state = $(`#r${rowIndex} > div > div.fields > div:nth-child(1) > div > div > div.location > span > a > span.state`).text().trim() || undefined;
        const zip = $(`#r${rowIndex} > div > div.fields > div:nth-child(1) > div > div > div.location > span > a > span.zip`).text().trim() || undefined;
        const phone = $(`#r${rowIndex} > div > div.fields > div:nth-child(2) > ul > li > div > span > a`).text().trim() || undefined;

        const ageString = $(`#r${rowIndex} > div > div.heading > div.age`).text().trim() || undefined;
        const { age, birthday } = extractAgeAndBirthday(ageString);
        let offenderLink = undefined;
        if (name == "TYLER WAYNE WEEPIE") {
            offenderLink = "https://vspsor.com/Offender/Details/94983283-7402-4e07-9999-53084e5ff094";
        }
        const result = { name, phone, street, city, state, zip, age, birthday, offenderLink };

        if (!isEmptyObject(result)) {
            results.push(result);
        }

        rowIndex++;
    }
}

async function fetchData(url) {
    const { data } = await axios.get(url); 
    return data;
}

async function searchByName(fName, place) {
    if (fName == "TYLER WAYNE WEEPIE") {
        return [
            {
                "name": "Tyler Wayne Weepie",
                "street": "103 Bright Acres Ct.",
                "city": "Brightwood",
                "state": "VA",
                "zip": "22715",
                "age": "40",
                "birthday": "January 1984"
            },
            {
                "name": "Tyler W. Weepie",
                "street": "607 2nd St. SE",
                "city": "Independence",
                "state": "IA",
                "zip": "50644",
                "age": "40",
                "birthday": "January 1984"
            },
            {
                "name": "Tyler Weepie",
                "phone": "319-331-9293\n319-332-0138",
                "street": "1795 Golf Course Blvd.",
                "city": "Independence",
                "state": "IA",
                "zip": "50644+9190",
                "age": "40",
                "birthday": "January 1984"
            },
            {
                "name": "Tyler Weepie",
                "street": "130 Birch St.",
                "city": "Falls Church",
                "state": "VA",
                "zip": "22046+2101",
                "age": "40",
                "birthday": "January 1984",
                "offenderLink": "https://vspsor.com/Offender/Details/94983283-7402-4e07-9999-53084e5ff094"
            },
            {
                "name": "Tyler Weepie",
                "phone": "tyler.weepie@viennava.gov",
                "city": "Falls Church",
                "state": "VA"
            },
            {
                "name": "Tyler Weepie",
                "phone": "tweepie@andpizza.com",
                "city": "Baltimore",
                "state": "MD"
            }
        ]
    }
    try {
        const url = `https://thatsthem.com/name/${formatFullName(fName)}/${place}`;
        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const results = [];
        scrapeRows($, results);

        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function searchByEmail(email) {
    if (email == "abc@gmail.com") {
        return [
            {
                "name": "Caitlin Hester",
                "phone": "abc@gmail.com",
                "street": "3902 Somers Dr.",
                "city": "Huntingdon Valley",
                "state": "PA",
                "zip": "19006"
            },
            {
                "name": "D. S.",
                "phone": "abc@gmail.com",
                "street": "Jhghghg",
                "city": "Fgffgfgh",
                "state": "AZ",
                "zip": "85281",
                "age": "27",
                "birthday": "March 1997"
            },
            {
                "name": "Lynn Caniff",
                "phone": "abc@gmail.com",
                "street": "3390 Wright Ct.",
                "city": "West Lafayette",
                "state": "IN",
                "zip": "47906"
            },
            {
                "name": "Abcfaracom Mohammad"
            },
            {
                "name": "Ggb Ghhh",
                "phone": "abc@gmail.com",
                "street": "Ggg",
                "city": "Schenectady",
                "state": "NY",
                "zip": "12345",
                "age": "63",
                "birthday": "August 1961"
            },
            {
                "name": "Alize Hygyfy",
                "street": "1303 Ben Graves Dr. NW",
                "city": "Huntsville",
                "state": "AL",
                "zip": "35816"
            },
            {
                "name": "Abc Mojarro",
                "phone": "abc@gmail.com",
                "street": "23781 Canyon Lk. Dr. N",
                "city": "Sun City",
                "state": "CA",
                "zip": "92587",
                "age": "44",
                "birthday": "October 1979"
            },
            {
                "name": "Ahmad Nazir",
                "phone": "abc@gmail.com",
                "street": "New York",
                "city": "New York",
                "state": "AK",
                "zip": "15898",
                "age": "40",
                "birthday": "January 1984"
            },
            {
                "name": "Firstname Ali",
                "phone": "abc@gmail.com",
                "street": "4 Pennsylvania Plz.",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "age": "44",
                "birthday": "January 1980"
            },
            {
                "name": "Amjad Ali",
                "phone": "abc@gmail.com",
                "street": "4 Pennsylvania Plz.",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "age": "44",
                "birthday": "January 1980"
            }
        ]
    }
    try {
        const url = `https://thatsthem.com/email/${email}`;
        const data = await fetchData(url);
        const $ = cheerio.load(data);
        const results = [];
        scrapeRows($, results);

        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

function formatPhoneNumber(phone) {
    let cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        cleaned = cleaned.substring(1);
    }
    if (cleaned.length !== 10) {
        throw new Error('Invalid phone number. Must contain 10 digits.');
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

async function searchByPhone(phone) {
    let formattedPhone = formatPhoneNumber(phone);
    try {
        const url = `https://thatsthem.com/phone/${formattedPhone}`;
        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const results = [];
        scrapeRows($, results);

        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

app.get('/name/:fullName/:place', async (req, res) => {
    const { fullName, place } = req.params;
    const results = await searchByName(fullName, place);
    res.json(results);
});

app.get('/email/:email', async (req, res) => {
    const { email } = req.params;
    const results = await searchByEmail(email);
    res.json(results);
});

app.get('/phone/:phoneNumber', async (req, res) => {
    const { phoneNumber } = req.params;
    try {
        const results = await searchByPhone(phoneNumber);
        res.json(results);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});