const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const dotenv = require('dotenv').config();


const path = require('path');
// global var
global.APP_ROOT = path.resolve(__dirname);
global.UPLOAD_PATH = `${path.resolve(__dirname)}/uploads`; 
global.DB_PATH = `${path.resolve(__dirname)}/data`; 


// const cookieParser = require('cookie-parser');
const cors = require('cors');


// const corsOptions = {
//     origin: [
//         'http://localhost',
//         'http://localhost:3001',
//         'http://localhost:5500',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,

// };

app.use(cors());
// app.use(cors(corsOptions));
// app.use(cookieParser());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(process.env.PORT, () => {
    console.log('listening on port %s...', server.address().port);
});




