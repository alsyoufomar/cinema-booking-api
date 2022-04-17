const prisma = require('../utils/prisma');

const createTicket = async (req, res) => {

  //Now when we create the ticket, we don't need the userId
  //to be passed in the request body - we can get it from the 
  //request object populated by the checkToken middleware. This means
  //that users (users here) can only ever created tickets for 
  //their own userId

  const userId = parseInt(req.userId)

  prisma.ticket.create({
    data: {
      screening: {
        connect: {
          id: req.body.screeningId,
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      screening: {
        include: {
          movie: true,
          screen: true
        }
      },
      user: true
    }
  }).then(createdTicket => {
    res.json({ data: createdTicket })
  })

}

module.exports = { createTicket }



// const createTicket = (req, res) => {
//   const { screeningId, userId } = req.body;

//   prisma.ticket.create({
//     data: {
//       screeningId,
//       userId
//     },
//     include: {
//       screening: true
//     }
//   })
//     .then(screen => res.json({ data: screen }))
// }

// module.exports = { createTicket };
