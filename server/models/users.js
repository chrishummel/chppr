var db = require('../database/db');
var Promise = require('bluebird');

var Users = module.exports

//Users.byType = function (type) {
//  return db('categories').where({ type: type }).limit(1)
//    .then(function (rows) {
//      return rows[0]
//    })
//}

Users.create = function (incomingAttrs) {	
	
	return db('users').insert({
    username: incomingAttrs.username,
    facebook_id: incomingAttrs.facebook_id,
    facebook_token: incomingAttrs.facebook_token
  })
  .then(function (result) {
    console.log('inserted user', result);
    return result[0];
  });
};

Users.findByFacebookID = function(id){
  return db('users').where({
    facebook_id: id
  })
  .then(function(result){
    console.log('found facebooker:', result);
    return result[0];
  })

}

Users.findById = function(userId){
  return db('users').where({
    uid: userId
  })
  .then(function(result){
    console.log('found id:',result);
    return result[0]
  })
}

Users.verify = function (username, password) {
	return db('users').where({
			username: username,
			password: password,
		}).limit(1)
		.then(function (rows) {
			console.log('user is :' + rows[0]);
      return rows[0]
		})
}



//only did categories here because we only use it once! not an actual relation to the users
Users.categories = function (incomingAttrs) {
	
	var attrs = Object.assign({}, incomingAttrs)
	
	return db('categories').insert(attrs)
    .then(function (result) {
      // Prepare new user for outside world
      return result[0];
    });
};



