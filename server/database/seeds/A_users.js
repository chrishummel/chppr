
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({ username: 'Rich', password: 'rich'}),
    knex('users').insert({ username: 'Pat L', password: 'PatL'}),
    knex('users').insert({ username: 'Hugh', password: 'Hugh'}),
    knex('users').insert({ username: 'Christina', password: 'Tina'}),
    knex('users').insert({ username: 'PatD', password: 'PatD'}),
    knex('users').insert({ username: 'Will', password: 'ferrel'})
  );
};
