const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const key = '87764d1a-92dc-4ced-a758-9c898c31d525'
const saltRounds = 10;

const createUser = async (req, res) => {
  const { name, role, username, password, phone, email } = req.body;

  const hash = await bcrypt.hash(password, saltRounds)
  const createdUser = await prisma.user.create({
    data: {
      name,
      role,
      username,
      password: hash,
      contact: {
        create: {
          phone,
          email
        }
      }
    },
    // We add an `include` outside of the `data` object to make sure the new contact is returned in the result
    // This is like doing RETURNING in SQL
    include: {
      contact: true
    }
  })
  res.json({ data: createdUser });
}

async function loginUser (req, res) {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log('maaaatch')
      const token = jwt.sign({ id: user.id, role: user.role }, key);
      res.json({ token });
    }
    else {
      console.log('Wrong Password!!')
      res.status(404)
      res.json({ error: 'Wrong Password!!' })
    }
  }
  else {
    res.status(404)
    res.json({ error: 'User Not Found' })
  }
}

function updateUser (req, res) {
  const { name, phone, email } = req.body

  prisma.user.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      name,
      contact: {
        update: {
          phone,
          email
        }
      }
    },
    include: {
      contact: true
    }
  })
    .then(user => res.json({ data: user }))
}

module.exports = { createUser, updateUser, loginUser };

