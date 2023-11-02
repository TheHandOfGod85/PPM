import jest from '@jest/globals'

import request from 'supertest'
import {
  connect,
  cleanData,
  disconnect,
} from '../__helpers__/mongodb.memory.test.helper'
import app from '../app'

jest.describe('user controller', () => {
  jest.beforeAll(connect)
  jest.beforeEach(cleanData)
  jest.afterAll(disconnect)
  jest.describe('signup endpoint', () => {
    jest.it('should create a new user admin and return it', async () => {
      const signupCredentials = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Pa$$0rd',
        role: 'admin',
      }
      const response = await request(app)
        .post('/user/signup')
        .send(signupCredentials)
      jest.expect(response.statusCode).toBe(201)
      jest.expect(response.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: jest.expect.anything(),
        updatedAt: jest.expect.anything(),
        _id: jest.expect.anything(),
        __v: jest.expect.anything(),
      })
    })
    jest.it(
      'should create a new user role user if a role is not supplied and return it',
      async () => {
        const signupCredentials = {
          username: 'user',
          email: 'user@test.com',
          password: 'Pa$$0rd',
        }
        const response = await request(app)
          .post('/user/signup')
          .send(signupCredentials)
        jest.expect(response.statusCode).toBe(201)
        jest.expect(response.body).toEqual({
          username: 'user',
          email: 'user@test.com',
          role: 'user',
          displayName: 'user',
          createdAt: jest.expect.anything(),
          updatedAt: jest.expect.anything(),
          _id: jest.expect.anything(),
          __v: jest.expect.anything(),
        })
      }
    )
    jest.it(
      'should return bad request if a wrong field input is supplied',
      async () => {
        const signupCredentials = {
          username: 'user',
          email: 'user@test.com',
          password: '',
        }
        const response = await request(app)
          .post('/user/signup')
          .send(signupCredentials)
        jest.expect(response.statusCode).toBe(400)
      }
    )
  })
  jest.describe('me endpoint', () => {
    jest.it('should return the current user', async () => {
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

      jest.expect(me.statusCode).toBe(200)
      jest.expect(me.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: jest.expect.anything(),
        updatedAt: jest.expect.anything(),
        _id: jest.expect.anything(),
        __v: jest.expect.anything(),
      })
    })
  })
  jest.describe('login endpoint', () => {
    jest.it('should return a user logged in', async () => {
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
      jest.expect(response.statusCode).toBe(200)
      jest.expect(response.body).toEqual({
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        displayName: 'admin',
        createdAt: jest.expect.anything(),
        updatedAt: jest.expect.anything(),
        _id: jest.expect.anything(),
        __v: jest.expect.anything(),
      })
    })
  })
  jest.describe('logout endpoint', () => {
    jest.it('should return a 200 status', async () => {
      const response = await request(app).post('/user/logout')
      jest.expect(response.statusCode).toBe(200)
    })
  })
})
