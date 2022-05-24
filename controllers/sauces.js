const mongoose = require('mongoose');
const { unlink } = require('fs');
//const { saucePouce } = require('./pouce');

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

  Sauce.find({})
    .then((sauces) => res.send(sauces))
    .catch((err) => console.log(err));
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
    .then((resSuccess) => {
      res.send({ message: resSuccess });
      return console.log('produit enregistré', resSuccess);
    })
    .catch((err) => console.log(err));
}

function sauceId(req, res) {
  const id = req.params.id;
  Sauce.findById(id)
    .then((sauce) => {
      res.send(sauce);
    })
    .catch((err) => console.log(err));
}
function sauceIdPouce(req, res) {
  const { id } = req.params;
  return Sauce.findById(id);
}

function sauceDelete(req, res) {
  const id = req.params.id;

  Sauce.findByIdAndDelete(id)

    .then((sauce) => {
      imageDelete(sauce);
      res.send({ message: sauce });
    })
    .catch((err) => res.status(500).send({ message: err }));
}

function imageDelete(sauce) {
  const imageUrl = sauce.imageUrl;
  console.log('image a DELETE', sauce.imageUrl);
  const imageToDelete = sauce.imageUrl.split('/').at(-1);
  unlink(`images/${imageToDelete}`, (err) => {
    console.log(err);
  });
}

function sauceModify(req, res) {
  const id = req.params.id;

  const imageUrl = req.file.destination + req.file.filename;
  const imageAbsolute = req.protocol + '://' + req.get('host') + '/' + imageUrl;
  const hasNewImage = imageAbsolute != null;

  const payload = makePayload(hasNewImage, req);

  Sauce.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))

    .then((sauce) => imageDelete(sauce))

    .catch((err) => console.error('PROBLEM UPDATING', err));
}

function makePayload(hasNewImage, req) {
  const imageUrl = req.file.destination + req.file.filename;
  const imageAbsolute = req.protocol + '://' + req.get('host') + '/' + imageUrl;
  console.log('hasNewImage:', hasNewImage);
  if (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = imageAbsolute;
  console.log('NOUVELLE IMAGE A GERER');
  console.log('voici le payload:', payload);
  return payload;
}

function sendClientResponse(product, res) {
  if (product == null) {
    console.log('NOTHING TO UPDATE');
    return res.status(404).send({ message: 'Object not found in database' });
  }
  console.log('ALL GOOD, UPDATING:', product);
  return Promise.resolve(res.status(200).send(product)).then(() => product);
}
module.exports = {
  sauceHome,
  sauceCreate,
  sauceId,
  sauceDelete,
  sauceModify,
  sendClientResponse,
  sauceId,
  sauceIdPouce,
  // saucePouce,
};
