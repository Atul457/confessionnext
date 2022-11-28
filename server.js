// Imports
const express = require('express');
const app = express();
const next = require('next');
const morgan = require('morgan');
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();


// Vars
const dev = process.env.NODE_ENV === 'production' ? false : true;
const PORT = process.env.PORT || 3234;
const nextjs = next({ dev });
const handle = nextjs.getRequestHandler();


// Middlewares
app.use(morgan('dev'));


// Next
nextjs.prepare().then(() => {
    app.all('*', (req, res) => {
        return handle(req, res);
    });
    const key = fs.readFileSync('/etc/letsencrypt/live/cloudart.com.au/privkey.pem');
    const cert = fs.readFileSync('/etc/letsencrypt/live/cloudart.com.au/fullchain.pem');
    const options = { key: key, cert: cert };

    if (process.env.NODE_ENV === 'development')
        http.createServer(server).listen(PORT, (err) => {
            if (err) throw err;
            console.log(`Application is running on http://localhost:${PORT}`);
        });
    else https.createServer(options, app).listen(PORT, (err) => {
        if (err) throw err
        console.log(`Server listening on https://cloudart.com.au/${PORT}`)
    });
}).catch(err => {
    console.log('Error:::::', err);
});
