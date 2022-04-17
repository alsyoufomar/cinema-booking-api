const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed () {
  const user = await createUser();
  const movies = await createMovies();
  const screens = await createScreens();
  await createScreenings(screens, movies);
  await createReview(user, movies)

  process.exit(0);
}

async function createUser () {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      username: 'aliceOscobar',
      password: 'alice',
      contact: {
        create: {
          email: 'alice@boolean.co.uk',
          phone: '1234567890'
        }
      }
    },
    include: {
      contact: true
    }
  });

  console.log('User created', user);

  return user;
}

async function createMovies () {
  const rawMovies = [
    { title: 'The Matrix', runtimeMins: 120 },
    { title: 'Dodgeball', runtimeMins: 154 },
  ];

  const movies = [];

  for (const rawMovie of rawMovies) {
    const movie = await prisma.movie.create({ data: rawMovie });
    movies.push(movie);
  }

  console.log('Movies created', movies);

  return movies;
}

async function createScreens () {
  const rawScreens = [
    { number: 1 }, { number: 2 }
  ];

  const screens = [];

  for (const rawScreen of rawScreens) {
    const screen = await prisma.screen.create({
      data: rawScreen
    });

    console.log('Screen created', screen);

    screens.push(screen);
  }

  return screens;
}

async function createScreenings (screens, movies) {
  const screeningDate = new Date();

  for (const screen of screens) {
    for (let i = 0; i < movies.length; i++) {
      screeningDate.setDate(screeningDate.getDate() + i);

      const screening = await prisma.screening.create({
        data: {
          startsAt: screeningDate,
          movie: {
            connect: {
              id: movies[i].id
            }
          },
          screen: {
            connect: {
              id: screen.id
            }
          }
        }
      });

      console.log('Screening created', screening);
    }
  }
}

async function createReview (user, movies) {
  console.log('movieeeeeeeeeeeeeees', movies, user)

  const review = await prisma.review.create({
    data: {
      content: 'I love kebab',
      movie: {
        connect: {
          id: movies[0].id
        }
      },
      user: {
        connect: {
          id: user.id
        }
      }
    },
    include: {
      movie: true,
      user: true
    }
  });

  console.log('review created', review);

  return review;

}

seed()
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));