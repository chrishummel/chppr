var db = require('../database/db');

var Post = module.exports

Post.create = function (incomingAttrs) {
	
	var attrs = Object.assign({}, incomingAttrs)
	
	console.log('create attrs:', attrs)
  return db('posts').insert(attrs)
    .then(function (result) {
      // Prepare new user for outside world
      return result[0];
    })
    .catch(function(err){
      console.log('here is the problem:', err);
    });
};

Post.loader = function () {	
	return db.select('*').from('posts').leftJoin('users', 'posts.user_id','users.uid').orderBy('timestamp') //.limit(5).offset(5)
    .then(function (result) {
      // Prepare new user for outside world
      return result;
    });
};

Post.single = function (postID) {
  return db.select('*').from('posts').where({postID: postID})
    .then(function(resp) {
      return resp;
    })
    .catch(function(err) {
      console.error('post.single err:', err);
    })
}
