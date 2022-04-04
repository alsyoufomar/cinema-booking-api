const prisma = require('../utils/prisma');


const createTicket = (req, res) => {
  const { screeningId, customerId } = req.body;
  // let options = { create: { movieId, startsAt } }
  // if (movieId === undefined) options = {}

  prisma.ticket.create({
    data: {
      screeningId,
      customerId
    }
  })
    .then(screen => res.json({ data: screen }))
}

module.exports = { createTicket };
