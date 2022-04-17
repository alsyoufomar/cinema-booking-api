const express = require("express");
const { createTicket } = require('../controllers/ticket');
const { checkToken } = require('../middleware/middleware')

const router = express.Router();

//Tell express that before our createTicket function is called,
//the checkToken middleware should be used. The createTicket function
//will be passed as the `next` argument to checkToken - checkToken
//can then invoke it using next() once it's validated the token.

router.post("/", checkToken, createTicket);


module.exports = router;