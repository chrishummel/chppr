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
	var attrs = Object.assign({}, incomingAttrs)
	
	return db('users').insert(attrs)
    .then(function (result) {
      // Prepare new user for outside world
      return result[0];
    });
};


Users.verify = function (username, password) {
	return db('users').where({
			username: username,
			password: password,
		}).limit(1)
		.then(function (rows) {
			return rows[0]
			console.log('user is :' + rows[0]);
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



