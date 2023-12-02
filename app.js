'use strict';
const express = require('express');
const mongoose = require('mongoose');

global.db = mongoose.createConnection('mongodb://127.0.0.1/social-network');

const routes = require('./routes');

const app = express();
const router = express.Router();

router.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
  });
  router.use('/', routes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

app.listen(8000, () => console.log('listening on http://127.0.0.1:8000'));