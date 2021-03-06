exports.up = function (knex, Promise) {
console.log('at start of migration')
	return Promise.all([
				
		//users table
		knex.schema.createTable('users', function(table){
			table.increments('uid').primary();
			table.string('username').unique();
			table.string('facebook_id');
			table.string('facebook_token');
			table.string('photo')
		}),
		
		//categories table
		knex.schema.createTable('categories', function(table){
			table.increments('cid').primary();
			table.string('type');
	}),
		
		//favorites table
		knex.schema.createTable('favorites', function(table){
			table.increments('id').primary();
			//foreign key to posts table
			table.integer('postID')
					 .references('postID')
					 .inTable('posts');
			//foreign key to users table		
			table.integer('userID')
					 .references('uid')
					 .inTable('users');
		}),

		//posts table
    knex.schema.createTable('posts', function (table) {
			table.increments('postID').primary();
			//foreign key to users table
			table.integer('user_id')
				.references('uid')
				.inTable('users');
			//foreign key to categories table
			table.integer('category')
				.references('cid')
				.inTable('categories');
			
			table.time('timestamp');
			table.string('dish_name');
			table.string('rest_name');
			table.string('rest_city');
			table.string('yelp_id');
			table.integer('price');
			table.string('picture_path');
			table.boolean('veggie');
			table.boolean('gluten_free');
			table.boolean('spicy');
			table.integer('rating');
		}),

		//location table
		// knex.schema.createTable('locations', function (table) {
		// 	table.increments('id').primary();
		// 	table.string('state_name').unique();
		// 	table.string('')

		// })
				
	]).then(function(){
		console.log('at end of migration')
	})
};

exports.down = function (knex, Promise) {

	return Promise.all([
        knex.schema.dropTable('posts'),
				knex.schema.dropTable('users'),
        knex.schema.dropTable('categories'),
        knex.schema.dropTable('favorites'),
    ])
};