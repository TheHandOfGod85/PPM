import request from 'supertest'
import {
  connect,
  cleanData,
  disconnect,
} from '../__helpers__/mongodb.memory.test.helper'
import app from '../app'

describe('user controller test suite', () => {
  beforeAll(connect)
  beforeEach(cleanData)
  afterAll(disconnect)
  describe('signup endpoint', () => {
    it('should create a new user admin and return it', async () => {
      const signupCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
        role: 'admin',
      }
      const response = await request(app)
        .post('/user/signup')
        .send(signupCredentials)
      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
        __v: expect.anything(),
      })
    })
    it('should create a new user role user if a role is not supplied and return it', async () => {
      const signupCredentials = {
        username: 'user',
        email: 'user@test.com',
        password: 'Pa$$0rd',
      }
      const response = await request(app)
        .post('/user/signup')
        .send(signupCredentials)
      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        username: 'user',
        email: 'user@test.com',
        role: 'user',
        displayName: 'user',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
        __v: expect.anything(),
      })
    })
    it('should return bad request if a wrong field input is supplied', async () => {
      const signupCredentials = {
        username: 'user',
        email: 'user@test.com',
        password: '',
      }
      const response = await request(app)
        .post('/user/signup')
        .send(signupCredentials)
      expect(response.statusCode).toBe(400)
    })
  })
  describe('me endpoint', () => {
    it('should return the current user', async () => {
      const signupCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
        role: 'admin',
      }

      await request(app).post('/user/signup').send(signupCredentials)
      const loginCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
      }

      const loggedInUser = await request(app)
        .post('/user/login')
        .send(loginCredentials)

      const authenticationCookie = loggedInUser.header['set-cookie']

      const me = await request(app)
        .get('/user/me')
        .set('Cookie', authenticationCookie)

      expect(me.statusCode).toBe(200)
      expect(me.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
        __v: expect.anything(),
      })
    })
  })
  describe('login endpoint', () => {
    it('should return a user logged in', async () => {
      const signupCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
        role: 'admin',
      }
      const userSignedUp = await request(app)
        .post('/user/signup')
        .send(signupCredentials)
      const loginCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
      }
      const response = await request(app)
        .post('/user/login')
        .send(loginCredentials)
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
        __v: expect.anything(),
      })
    })
  })
  describe('logout endpoint', () => {
    it('should return a 200 status', async () => {
      const response = await request(app).post('/user/logout')
      expect(response.statusCode).toBe(200)
    })
  })
})
