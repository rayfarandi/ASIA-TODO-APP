module.exports = {
  development: {
    client: 'pg', // PostgreSQL
    connection: {
      host: 'localhost', // your hostname
      user: 'postgres', // your username
      password: '1', // your password
      database: 'todoapp', // your database name
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
}
