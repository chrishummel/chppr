var db = require('../database/db');

var Post = module.exports

Post.create = function (incomingAttrs) {
	
	var attrs = Object.assign({}, incomingAttrs)
	
	console.log('create attrs:', attrs)
  return db('posts').insert(attrs)
    .then(function (result) {
      // Prepare new user for outside world
      return result[0];
    });
};

Post.loader = function () {	
	return db.select('*').from('posts').orderBy('timestamp') //.limit(5).offset(5)
    .then(function (result) {
      // Prepare new user for outside world
      return result;
    });
};
