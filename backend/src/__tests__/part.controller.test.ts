import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals'
import {
  cleanData,
  connect,
  disconnect,
} from '../__helpers__/mongodb.memory.test.helper'
import request from 'supertest'
import app from '../app'

const signupCredentials = {
  username: 'admin',
  email: 'admin@test.com',
  password: 'Pa$$0rd',
  role: 'admin',
}

const loginCredentials = {
  username: 'admin',
  email: 'admin@test.com',
  password: 'Pa$$0rd',
}
let authenticationCookie: any

describe('partController test suite', () => {
  beforeAll(connect)
  beforeEach(cleanData)
  afterAll(disconnect)
  beforeEach(async () => {
    // Set the authentication cookie before each test
    await request(app).post('/user/signup').send(signupCredentials)
    const loggedInUser = await request(app)
      .post('/user/login')
      .send(loginCredentials)
    authenticationCookie = loggedInUser.header['set-cookie']
  })
  describe('createPartHandler endpoint', () => {
    it('should return a created part', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)

      const part = {
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd',
        manufacturer: 'Mozzi',
      }
      const response = await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part)
      expect(response.statusCode).toBe(201)
    })
    it('should return 400 if same partNumber is provided', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      const part1 = {
        name: 'bearing1',
        description: 'fsdfksj',
        partNumber: 'pppspspd2',
        manufacturer: 'Mozzi',
      }
      const part2 = {
        name: 'bearing2',
        description: 'fsdfksj',
        partNumber: 'pppspspd2',
        manufacturer: 'Mozzi',
      }
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part1)
      const response = await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part2)

      expect(response.statusCode).toBe(400)
      expect(response.body.errors).toEqual('partNumber is unique.')
    })
  })
  describe('findPartsHandler endpoint', () => {
    it('should return a list of parts', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      const part1 = {
        name: 'bearing1',
        description: 'fsdfksj',
        partNumber: 'pppspspd1',
        manufacturer: 'Mozzi',
      }
      const part2 = {
        name: 'bearing2',
        description: 'fsdfksj',
        partNumber: 'pppspspd2',
        manufacturer: 'Mozzi',
      }
      const part3 = {
        name: 'bearing3',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
      }
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part1)
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part2)
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part3)

      const response = await request(app)
        .get('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(3)
    })
  })
  describe('findPartHandler endpoint', () => {
    it('it should return a part by id', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      const partId = '653fea85466d065471a131a5'
      const part = {
        _id: partId,
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
      }
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part)
      const response = await request(app)
        .get('/part/' + partId)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('updatePartHandler endpoint', () => {
    it('should return the updated part', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      const partId = '653fea85466d065471a131a5'
      const part = {
        _id: partId,
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
      }
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part)
      const updatedPart = {
        name: 'bearing 9',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
      }
      const response = await request(app)
        .patch('/part/' + partId)
        .send(updatedPart)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        name: 'bearing 9',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
        id: expect.anything(),
        _id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    })
  })
  describe('deletePartHandler endpoint', () => {
    it('should delete a part by id', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      const partId = '653fea85466d065471a131a5'
      const part = {
        _id: partId,
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd3',
        manufacturer: 'Mozzi',
      }
      await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part)
      const response = await request(app)
        .delete('/part/' + partId)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(204)
    })
  })
})
