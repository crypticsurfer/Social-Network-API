const express = require('express');
const user = require('./users');
const thought = require('./thoughts');
require('./schemas');

const router = express.Router();

router.use('/user', user);
router.use('/thought', thought);

module.exports = router;

