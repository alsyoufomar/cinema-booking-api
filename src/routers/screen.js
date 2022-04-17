const express = require("express");
const { createScreen } = require('../controllers/screen');
const { checkManager, checkToken } = require('../middleware/middleware');

const router = express.Router();

router.post("/", checkToken, checkManager, createScreen);

module.exports = router;