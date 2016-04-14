
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({ username: 'Chris1', facebook_id: 'numbersAndThings1'}),
    knex('users').insert({ username: 'Chris2', facebook_id: 'numbersAndThings2'}),
    knex('users').insert({ username: 'Chris3', facebook_id: 'numbersAndThings3'}),
    knex('users').insert({ username: 'Chris4', facebook_id: 'numbersAndThings4'}),
    knex('users').insert({ username: 'Chris5', facebook_id: 'numbersAndThings5'}),
    knex('users').insert({ username: 'Chris6', facebook_id: 'numbersAndThings6'})
    
  );
};
