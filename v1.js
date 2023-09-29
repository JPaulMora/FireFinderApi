const express = require('express');
const router = express.Router();
const wc = require('which-country');
const axios = require('axios');
const df = require('date-fns');

const cacheDuration = 3600000;

router.use(function (req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.APIversion = 1;
        res._json(obj);
    };
    next();
});

// Fetch data from NASA endpoint

async function fetchData(month, year) {
    const monthMap = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
    };

    if (!monthMap.hasOwnProperty(month)) {
       throw new Error('Invalid month shortcode.');
    }

    let end_date = new Date();
    end_date.setMonth(monthMap[month]);
    end_date.setFullYear(year);

    let end_date_str = df.format(end_date, "yyyy-MM-dd");

    let start_date = new Date(end_date_str);
    let start_year = start_date.getFullYear() - 3;
    start_date.setFullYear(start_year); // We will assume no fire has lasted for over three years

    let start_date_str = df.format(start_date, "yyyy-MM-dd");

    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=closed&start=${start_date_str}&end=${end_date_str}`;

    res = await axios.get(url);
}


// Debugging purposes
router.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

router.get("/fires", async (request, response) => {
    let month = request.query.month;
    let year = request.query.year;

    fetchData(month, year).then(res => {
        response.send(res);
    }).catch(err => {
        response.status = 500;
        res.json({
            success: false,
            message: 'Internal server error'
        });
    })
})

//Done - catch all - return command failed
router.get('*', function (req, res) {
    res.status = 404;
    res.json({
        success: false,
        message: 'Unknown command'
    });
});

module.exports = router;
