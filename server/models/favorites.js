var db = require('../database/db');

var Favorites = module.exports


Favorites.add = function(userID, postID) {
  return db('favorites').where({userID: userID, postID: postID})
  .then(function(result){
    var alreadyFav = false;
    if(result[0]) { 
      alreadyFav = true;
      return result[0]  
    } else {
      db('favorites').insert({
        userID: userID,
        postID: postID
      })
      .then(function(resp) {
        console.log('addFavorite response: ', resp);
        return resp;
      })
    }
    
  })
};

Favorites.getFavByUserID = function(userID) {
  return db('favorites').where({userID: userID})
    .then(function(resp) {
      console.log('find fav resp: ', resp);
      return resp;
    })
};

