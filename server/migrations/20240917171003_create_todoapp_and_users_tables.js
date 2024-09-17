exports.up = function(knex) {
    return knex.schema
      .createTable('todoapp', (table) => {
        table.string('id', 255).primary();
        table.string('user_email', 255);
        table.string('title', 30);
        table.string('description', 255);
        table.integer('progress');
        table.string('date', 300);
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updatedAt');
      })
      .createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email', 255).unique();
        table.string('hashed_password', 255);
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updatedAt');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('todoapp')
      .dropTableIfExists('users');
  };
  