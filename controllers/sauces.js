const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const sauceSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

function sauceHome(req, res) {
  const header = req.header('Authorization');

  if (header == null) return res.status(403).send({ message: 'Invalid' });
  const token = header.split(' ')[1];
  if (token == null)
    return res.status(403).send({ message: "token can't be null" });

  jsonwebtoken.verify(token, process.env.TOKENPASSWORD, (err, tokenVerify) =>
    tokenVerifyier(err, tokenVerify, res)
  );
}
function tokenVerifyier(err, tokenVerify, res) {
  if (err) res.status(403).send({ message: 'token invalid' + err });
  else {
    console.log('Token good !!', tokenVerify);
    res.send({ message: [{ sauce: 'sauce1' }, { sauce: 'sauce2' }] });
  }
}

function sauceCreate(req, res) {}

module.exports = { sauceHome, sauceCreate };
