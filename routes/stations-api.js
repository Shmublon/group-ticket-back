/**
 * Created by artem-kalantay on 11.05.16.
 */

const express = require('express');
const router = express.Router();
const request = require('request');
const iconv = require('iconv-lite');

router.get('/stations/:name', function (req, res) {
    request({
        method: 'GET',
        uri: 'https://reiseauskunft.bahn.de/bin/ajax-getstop.exe/dn?REQ0JourneyStopsS0A=7&REQ0JourneyStopsB=12&REQ0JourneyStopsS0G=' + req.params.name + '?',
        encoding: null,
    }, function (error, response, body) {
        const bodyWithCorrectEncoding = iconv.decode(body, 'ISO-8859-1');
        const returned = bodyWithCorrectEncoding.replace(new RegExp("\\w+[.]\\w+=(.*);\\w+.\\w+\\(\\);"), "$1");
        res.send(returned);
    });
});

module.exports = router;
