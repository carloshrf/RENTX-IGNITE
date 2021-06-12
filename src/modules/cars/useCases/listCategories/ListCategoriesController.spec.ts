import app from '@shared/infra/http/app'
import request from 'supertest'
import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

let connection: Connection;

describe('List Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(`
      INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
        VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', 'now')
    `)
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it('should be able to lest all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });

    const { token } = responseToken.body;

    await request(app).post('/categories').send({
      name: "super test category",
      description: "a super test for category"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get('/categories')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  });
});