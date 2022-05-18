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
const Sauce = mongoose.model('Sauce', sauceSchema);

function sauceHome(req, res) {
  console.log('Token user is true , we are in sauceHome');

  // console.log('Token good !!', tokenVerify);
  Sauce.find({}).then((sauces) => res.send(sauces));
  // res.send({ message: [{ sauce: 'sauce1' }, { sauce: 'sauce2' }] });
}

function sauceCreate(req, res) {
  const sauces = JSON.parse(req.body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } = sauces;
  console.log(req.body, req.file);
  const imageUrl = req.file.destination + req.file.filename;
  const sauce = new Sauce({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: req.protocol + '://' + req.get('host') + '/' + imageUrl,
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then((res) => console.log('produit enregistré', res))
    .catch((err) => console.log(err));
}

module.exports = { sauceHome, sauceCreate };
