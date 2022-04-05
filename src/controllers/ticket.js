const prisma = require('../utils/prisma');


const createTicket = (req, res) => {
  const { screeningId, customerId } = req.body;

  prisma.ticket.create({
    data: {
      screeningId,
      customerId
    },
    include: {
      screening: true
    }
  })
    .then(screen => res.json({ data: screen }))
}

module.exports = { createTicket };
