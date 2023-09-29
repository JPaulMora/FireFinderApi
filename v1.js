const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.APIversion = 1;
        res._json(obj);
    };
    next();
});


router.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    
    response.send(status);
    });

//Done - catch all - return command failed
router.get('*', function (req, res) {
    res.status = 404;
    res.json({
        success: false,
        message: 'Unknown command'
    });
});

module.exports = router;
