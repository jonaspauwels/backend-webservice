module.exports = {
    log: {
      level: 'silly',
      disabled: false,
    },
    cors: {
      origins: ['http://localhost:5173'], 
      maxAge: 3 * 60 * 60, 
    },
    database: {
      client: 'mysql',
      host: 'localhost',
      port: 3306,
      name: 'fruit',
      username: 'root',
    },
  };
  