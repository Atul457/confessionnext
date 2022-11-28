const express = require('express');
const server = express();
const next = require('next');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
require('dotenv').config();

// Middlwares
server.use(morgan('dev'));

const dev = process.env.NODE_ENV === 'production' ? false : true;

const app = next({ dev });
const handle = app.getRequestHandler();
// Start Server
const PORT = process.env.PORT || 2000;

app.prepare().then(() => {
    server.use(express.static(path.join(__dirname, 'public')))
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    if (process.env.NODE_ENV === 'development') {

        http.createServer(server).listen(PORT, (err) => {
            if (err) throw err;
            console.log(`Application is running on http://localhost:${PORT}`);
        });
    }

    else {
        server.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`Application is running on http://localhost:${PORT}`);
        });
    }

}).catch(err => {
    console.log('Error:::::', err);
});