const { withServer, login } = require('./supertest.setup');
const { testAuthHeader } = require('./common/auth');


describe('Users', () => {
  let request;
  let sequelize;
  let authHeader;

  withServer(({supertest, sequelize: s}) => {
    request = supertest;
    sequelize = s;
});

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/users';

  describe('GET /api/users', () => {

    it('should 200 and return all users', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.users[0]).toEqual({
        id: 1,
        naam: 'Test User',
        email: 'test.user@hogent.be',
        roles: JSON.stringify(['user'])
    }
    );
    expect(response.body.users[1]).toEqual({
      id: 2,
      naam: 'Admin User',
      email: 'admin.user@hogent.be',
      roles: JSON.stringify(["admin", "user"])
    });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(url+'?invalid=true').set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/user/:id', () => {

    it('should 200 and return the requested user', async () => {
      const response = await request.get(url+'/1').set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        naam: 'Test User',
        email: 'test.user@hogent.be',
        roles: JSON.stringify(['user'])
      });
    });

    it('should 400 with invalid user id', async () => {
      const response = await request.get(url+'/invalid').set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('POST /api/users/register', () => {

    it('should 200 and return the created user', async () => {
      const response = await request.post(url+'/register').set('Authorization', authHeader)
        .send({
          naam: 'New User',
          email: 'new.user@hogent.be',
          password:
            '12345678'
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.naam).toEqual('New User');
      expect(response.body.user.email).toEqual('new.user@hogent.be')
    });

    it('should 400 when missing naam', async () => {
      const response = await request.post(url+'/register').set('Authorization', authHeader)
        .send({
          email: 'new.user@hogent.be',
          password_hash:
            '12345678',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

    it('should 400 when missing email', async () => {
        const response = await request.post(url+'/register').set('Authorization', authHeader)
          .send({
            naam: 'New User',
            password:
              '12345678',
          });
  
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_FAILED');
        expect(response.body.details.body).toHaveProperty('email');
      });

      it('should 400 when missing password', async () => {
        const response = await request.post(url+'/register').set('Authorization', authHeader)
          .send({
            naam: 'New User',
            email: 'new.user@hogent.be',
          });
  
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_FAILED');
        expect(response.body.details.body).toHaveProperty('password');
      });

     
  });

  describe('PUT /api/users/:id', () => {

    it('should 200 and return the updated user', async () => {
      const response = await request.put(url+'/1').set('Authorization', authHeader)
        .send({
          naam: 'New User',
          email: 'new.user@hogent.be',
          password:
            '123456789'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id:1,
        naam: 'New User',
        email: 'new.user@hogent.be',
        roles: '"user"'
      });
    });

    it('should 400 when missing naam', async () => {
      const response = await request.put(url+'/1').set('Authorization', authHeader)
        .send({
          email: 'new.user@hogent.be',
          password:
            '12345678'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

    it('should 400 when missing email', async () => {
        const response = await request.put(url+'/1').set('Authorization', authHeader)
          .send({
            naam: 'New User',
            password: '1234578'
          });
  
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_FAILED');
        expect(response.body.details.body).toHaveProperty('email');
      });

      it('should 400 when missing password', async () => {
        const response = await request.put(url+'/1').set('Authorization', authHeader)
          .send({
            naam: 'New User',
            email: 'new.user@hogent.be',
          });
  
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_FAILED');
        expect(response.body.details.body).toHaveProperty('password');
      });

    it('should 404 with not existing user', async () => {
      const response = await request.put(url+'/5').set('Authorization', authHeader).send({
        naam: 'New User',
        email: 'new.user@hogent.be',
        password:
          '123456789'
      });
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  describe('DELETE /api/users/:id', () => {

    it('should return 204 and empty body', async () => {
      const response = await request.delete(url+'/1').set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body[0]).toEqual(undefined);
    });

    it('should 400 with invalid user id', async () => {
      const response = await request.get(url+'/invalid').set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(url+'/5').set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });
  
  testAuthHeader(() => request.get(url));
});
