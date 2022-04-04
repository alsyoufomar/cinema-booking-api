const prisma = require('../utils/prisma');


const createScreen = (req, res) => {
  const { number, movieId, startsAt } = req.body;
  let options = { create: { movieId, startsAt } }
  if (movieId === undefined) options = {}

  prisma.screen.create({
    data: {
      number,
      screenings: options
    },
    include: {
      screenings: true
    }
  })
    .then(screen => res.json({ data: screen }))
}

module.exports = { createScreen };
