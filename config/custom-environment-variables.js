module.exports = {
    env: 'NODE_ENV',
    port: 'PORT',
    database: {
      // host: 'DATABASE_HOST',
      // port: 'DATABASE_PORT',
      // name: 'DATABASE_NAME',
      // username: 'DATABASE_USERNAME',
      // password: process.env.DATABASE_PASSWORD,
      client: process.env.DATABASE_CLIENT,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    },
    auth: {
      jwt: {
        secret: 'AUTH_JWT_SECRET',
      },
    },
  };
  