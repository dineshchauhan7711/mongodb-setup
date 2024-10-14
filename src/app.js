const response = require('./helpers/response');

const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const multer = require('multer');
const helmet = require('helmet');
const upload = multer();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));


// Routes 
app.use('/api/v1', require('./routes'));

// Not found url
app.use((req, res) => {
     return response.error(res, 9001, 404)
});

// Error
app.use((err, req, res, next) => {
     console.log('Error ==>>> ', err)
     return response.error(res, 9999)
});

module.exports = app;