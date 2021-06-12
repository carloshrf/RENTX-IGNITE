import app from '@shared/infra/http/app'
import request from 'supertest'
import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

let connection: Connection;

describe('Create Category Controller', () => {
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

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/categories').send({
      name: "super test category",
      description: "a super test for category"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201)
  });

  it('should be able to create the same category twice', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/categories').send({
      name: "super test category",
      description: "a super test for category"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400)
  });
});