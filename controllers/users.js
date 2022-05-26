const { User } = require('../mongo');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

async function signupUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await hashPassword(password);

  const user = new User({
    email: email,
    password: hashedPassword,
  });
  user
    .save()
    .then(() => {
      res.status(201).send({ message: 'Signup with success' });
    })
    .catch((err) =>
      res.status(409).send({ message: "Problème d'enregistrement ! " + err })
    );
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function loginUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const valablePassword = await bcrypt.compare(password, user.password);
    if (!valablePassword) {
      res.status(401).send({ message: 'Mot de passe incorrect' });
      return;
    }

    const token = createToken(email);
    res.status(200).send({ userId: user?._id, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Internal Error' });
  }
}
function createToken(email) {
  const tokenPassword = process.env.TOKENPASSWORD;
  const token = jsonwebtoken.sign({ email: email }, tokenPassword, {
    expiresIn: '24h',
  });
  return token;
}

module.exports = { signupUser, loginUser };
