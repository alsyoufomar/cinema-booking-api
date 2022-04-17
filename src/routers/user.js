const express = require("express");
const { createUser, updateUser, loginUser } = require('../controllers/user');

const router = express.Router();

// In index.js, we told express that the /user route should use this router file
// The below /register route extends that, so the end result will be a URL
// that looks like http://localhost:4000/user/register
router.post("/register", createUser);
router.post("/login", loginUser);

router.patch("/:id", updateUser);
module.exports = router;
