'use strict';

require('dotenv').config();


module.exports = (app) => {
    app.enable('trust proxy');
    
    app.use ( (req, res, next) => {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            console.log("Redirecting to https");
            const proxypath = process.env.PROXY_PASS || ''
            // request was via http, so redirect to https
            res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
        }
    });

    app.listen(3000);
};