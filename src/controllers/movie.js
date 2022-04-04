const prisma = require('../utils/prisma');


const createMovie = (req, res) => {
  const { title, runtimeMins, screenId, startsAt } = req.body;
  let options = { create: { screenId, startsAt } }
  if (screenId === undefined) options = {}

  prisma.movie.create({
    data: {
      title,
      runtimeMins,
      screenings: options
    },
    include: {
      screenings: true
    }
  })
    .then(movie => res.json({ data: movie }))
    .catch(err => {
      res.status(500)
      res.json({ error: "movie already exists" })
    })
}

function getSingleMovie (req, res) {
  let options = {}
  if (isNaN(parseInt(req.params.id))) {
    options = { title: (req.params.id) }
  } else options = { id: parseInt(req.params.id) }


  prisma.movie.findUnique({ where: options })
    .then(movie => {
      if (!movie) {
        res.status(404)
        res.json({ error: 'Movie not found' })
      } else {
        res.json({ movie: movie })
      }
    })
}


const getMovies = async (req, res) => {
  const { greaterThan, lessThan } = req.query
  let where = {}
  if (greaterThan) {
    where = {
      ['runtimeMins']: {
        gt: parseInt(greaterThan)
      }
    }
  }
  if (lessThan) {
    where = {
      ['runtimeMins']: {
        ...where.runtimeMins,
        lt: parseInt(lessThan)
      }
    }
  }
  const foundMovie = await prisma.movie.findMany({
    where,
    include: { screenings: true }
  })
  res.json({ movies: foundMovie });
}

function updateMovie (req, res) {
  const { title, runtimeMins, screeningId, screenId, startsAt } = req.body

  prisma.movie.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      title,
      runtimeMins,
      screenings: {
        update: {
          where: {
            id: parseInt(screeningId)
          },
          data: {
            screenId,
            startsAt
          }
        }
      }
    },
    include: {
      screenings: true
    }
  })
    .then(movie => res.json({ data: movie }))
}

module.exports = { getMovies, createMovie, getSingleMovie, updateMovie };


/**
 const update = await prisma.user.update({
  where: {
    id: 6,
  },
  data: {
    posts: {
      update: {
        where: {
          id: 9,
        },
        data: {
          title: 'My updated title',
        },
      },
    },
  },
})
 */