// Update with your config settings.
require('dotenv').config();
// dotenv.config({ path: "./env" });
module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },
  ssl: true,
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './data/auth.sqlite3'
  //   },
  //   useNullAsDefault: true,
  //   migrations: {
  //     directory: './data/migrations',
  //   },
  //   seeds: {
  //     directory: './data/seeds'
  //   },
  //   pool: {
  //     afterCreate: (conn, done) => {
  //       conn.run('PRAGMA foreign_keys = ON', done);
  //     }
  // }
// },

    // testing: {
    //   client: 'pg',
    //   // version: '7.2',
    //   connection: {
    //     host : 'aa10su4jt2enzmn.cudv4hjvenyx.us-east-2.rds.amazonaws.com',
    //     user : 'lambda',
    //     password : 'password',
    //     database : 'welldone'
    //   }
    // },

    production: {
      client: 'postgresql',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: './data/migrations',
      },
      seeds: { directory: './data/seeds' },
    },
    ssl: true
};