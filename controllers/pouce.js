const mongoose = require('mongoose');

const { sauceHome, sendClientResponse } = require('./sauces');

function saucePouce(req, res) {
  const { like, userId } = req.body;
  console.log('Poucesauce', req);
  if (![1, -1, 0].includes(like))
    return res.status(403).send({ message: 'Invalid like value' });

  sauceHome(req, res)
    .then((log) => console.log(log))
    .then((sauce) => updatePouce(sauce, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err));
}

function updatePouce(sauce, like, userId, res) {
  if (like === 1 || like === -1) return incrementPouce(sauce, userId, like);
  return resetPouce(sauce, userId, res);
}

function resetPouce(sauce, userId, res) {
  const { usersLiked, usersDisliked } = sauce;
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject('User seems to have voted both ways');

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject('User seems to not have voted');

  if (usersLiked.includes(userId)) {
    --sauce.likes;
    sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
  } else {
    --sauce.dislikes;
    sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
  }

  return sauce;
}

function incrementPouce(sauce, userId, like) {
  const { usersLiked, usersDisliked } = sauce;

  const votersArray = like === 1 ? usersLiked : usersDisliked;
  if (votersArray.includes(userId)) return sauce;
  votersArray.push(userId);

  like === 1 ? ++sauce.likes : ++sauce.dislikes;
  return sauce;
}

module.exports = { saucePouce };
