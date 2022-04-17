const jwt = require('jsonwebtoken')


//This is duplicated between the login controller and here - this is
//not good, we'd usually have this value stored in the .env file and 
//then read it using process.env.SECRET or something similar. 
const key = '87764d1a-92dc-4ced-a758-9c898c31d525'

//Our middleware function that checks if the user is logged 
//in by verifying the JWT.
const checkToken = async (req, res, next) => {

  //Do the usual check on the headers. Inside middleware,
  //we can access the request and response objects just
  //like we can in our regular handler functions
  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(401)
    res.json({ error: 'token is not valid, no header' })
    return
  }

  const parts = authorization.split(' ')
  const token = parts[1]
  try {
    const payload = jwt.verify(token, key)
    //If the token is valid, store the userId from the payload
    //on the request object. This allows our controller functions
    //to access the userId directly from req
    req.userId = payload.id

    //Call the next middleware/controller function!
    next()
  }
  catch (e) {
    //If the token is not valid, then return an error. The controller
    //will not be called in this case.
    res.status(401)
    res.json({ error: 'token is not valid:' + e })
    return
  }
}


async function checkManager (req, res, next) {
  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(403)
    res.json({ error: 'token is invalid' })
    return
  }
  console.log('pass 1')
  const parts = authorization.split(' ')
  const token = parts[1]
  const payload = jwt.verify(token, key)
  req.role = payload.role

  if (req.role === "MANAGER") {
    console.log('pass 2')
    next()
  }
  else {
    res.status(403)
    res.json({ error: 'Invalid token mate!' })
    return
  }
}

//If we wanted to add a new middleware to check if a user was a manager,
//we could add the users role in to the token payload on login, and then
//in the check token middleware attach it to the request the same way we
//did with the userId. A new middleware function could then check 
//the user was a manager before calling the next middleware:
//
// const checkManager = async(req, res, next) => {
//   if(req.role=="MANAGER") {
//     next()
//   } else {
//     res.status(401)
//   }
// }

module.exports = {
  checkToken,
  checkManager
}
