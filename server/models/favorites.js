var db = require('../database/db');

var Favorites = module.exports


Favorites.add = function(userID, postID) {
  return db('favorites').insert({
    userID: userID,
    postID: postID
  })
  .then(function(resp) {
    console.log('addFavorite response: ', resp);
    return resp;
  })
};

Favorites.getFavByUserID = function(userID) {
  return db('favorites').where({userID: userID})
    .then(function(resp) {
      console.log('find fav resp: ', resp);
      return resp;
    })
};

