module.exports = {
    log: {
      level: 'info',
      disabled: false,
    },
    cors: {
      origins: ['http://localhost:5173'], 
      maxAge: 3 * 60 * 60, 
    },
    auth: {
      argon: {
        saltLength: 16,
        hashLength: 32,
        timeCost: 6,
        memoryCost: 2 ** 17,
      },
      jwt: {
        secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        expirationInterval: 60 * 60 * 1000, // ms (1 hour)
        issuer: 'budget.hogent.be',
        audience: 'budget.hogent.be',
      },
    },
    database: {
      client: process.env.DATABASE_CLIENT,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    },
    port: 9000,
  };
  