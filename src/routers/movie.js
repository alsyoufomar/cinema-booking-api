const express = require("express");
const { getMovies, createMovie, getSingleMovie, updateMovie } = require('../controllers/movie');
const { checkToken, checkManager } = require('../middleware/middleware')



const router = express.Router();

//In this example, we want to use the checkToken middleware
//for *all* endpoints on this router - rather than defining it
//for each router like we did in the ticket router. We can use
//the `use` method to do this.
//
//Noe that this use method is exactly the same method we use
//to plugin other middleware in index.js - how cool is that?? very cool!

router.use(checkToken)

router.get("/", getMovies);

router.get('/:id', getSingleMovie)

router.use(checkManager)

router.post("/", createMovie);

router.patch('/:id', updateMovie);

//If we also wanted to have an additional middleware we specified
//for routes that only a manager should access, we could do that 
//by chaining in the route definition like below - the checkToken
//middleware would be run first, and then checkManager.
//
//router.put("/:id", checkManager, controller.updateMovie)
//router.post("/",checkManager, controller.createMovie)

module.exports = router;