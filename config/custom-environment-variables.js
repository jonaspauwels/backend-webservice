module.exports = {
  env: 'NODE_ENV',
  datapas: 'DATA_PASS',
  port: 'PORT',
  database: {
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    name: 'DATABASE_NAME',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
    client: 'DATABASE_CLIENT'
  },
  auth: {
    jwt: {
      secret: 'AUTH_JWT_SECRET',
    },
  },
};