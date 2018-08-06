/**
 * Created by artem-kalantay on 11.05.16.
 */

const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const request = require('request');

router.get('/trains/:from/:to/:date/:time', function (req, res) {
    getTrains(req.params.from, req.params.to, req.params.date, req.params.time).then(result => {
        res.setHeader("Content-Type", "application/json");
    res.send(result)
});
});

function getTrains(from, to, date, time) {
    return new Promise(function (resolve, reject) {
        try {
            (async () => {
                // const browser = await puppeteer.launch({headless: false});
                const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.goto('https://reiseauskunft.bahn.de/bin/query.exe/');
            await page.type('.from', from);
            await page.type('.to', to);
            const dateInput = await page.$('#REQ0JourneyDate');
            await dateInput.click({clickCount: 3});
            await dateInput.type(date);
            const timeInput = await page.$('#REQ0JourneyTime');
            await timeInput.click({clickCount: 3});
            await timeInput.type(time);
            await page.select('#traveller_Nr', '5');
            await page.click('.submit-btn');
            try {
                await page.waitForSelector('.later', {timeout: 10000});
            } catch (err) {
                await page.click('.submit-btn');
                await page.waitForSelector('.later');
            }
            await page.click('.later');
            await page.waitForSelector('.later');
            await page.click('.later');
            await page.waitForSelector('.later');
            const trains = await page.evaluate(() => {
                const lines = Array.from(document.querySelectorAll('tbody.boxShadow'));
            return lines.map(type => {
                let result = {};
            result.startStation = type.querySelector('tr.firstrow td.station').textContent.trim();
            result.endStation = type.querySelector('tr.last td.station').textContent.trim();
            result.startTime = type.querySelector('tr.firstrow td.time').textContent.trim().split(' ')[0];
            result.endTime = type.querySelector('tr.last td.time').textContent.trim().split(' ')[0];
            result.trainsType = type.querySelector('tr.firstrow td.products').textContent.trim();
            if (type.querySelector('td.fareStd a') !== null) {
                result.tarifType = type.querySelector('td.fareStd a').textContent.trim();
            } else {
                result.tarifType = '';
            }
            if (type.querySelector('td.fareStd span.fareOutput') !== null) {
                result.tarif = type.querySelector('td.fareStd span.fareOutput').textContent.trim();
            } else {
                result.tarif = '';
            }
            return result;
        });
        });


            resolve(trains);

            await browser.close();
        })()
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

module.exports = router;
