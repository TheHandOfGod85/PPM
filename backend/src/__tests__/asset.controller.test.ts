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
describe('asset controller test suite', () => {
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
  describe('createAssetHandler endpoint', () => {
    it('should return the asset created', async () => {
      const asset = {
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }

      const response = await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: expect.anything(),
        id: expect.anything(),
      })
    })
    it('should give a statusCode of 400 if a required field as serialNumber is not provided', async () => {
      const asset = {
        name: 'bagger',
        description: 'fsdfksj',
      }
      const response = await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(400)
    })
  })
  describe('findAssetHandler endpoint', () => {
    it('should return 404 if an asset is not found', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const response = await request(app)
        .get('/assets/' + id)
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(404)
      expect(response.body.errors).toEqual(`No asset found with id ${id}`)
    })
    it('should return an asset found', async () => {
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

      const response = await request(app)
        .get('/assets/' + id)
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        _id: '65453f5636cb1bfcf0b98722',
        id: expect.anything(),
        parts: expect.anything(),
      })
    })
  })
  describe('findAssetsHandler endpoint', () => {
    it('should return an empty array', async () => {
      const response = await request(app)
        .get('/assets/')
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([])
    })
    it('should return an array of assets', async () => {
      const asset1 = {
        name: 'bagger 2',
        description: 'fsdfksj',
        serialNumber: 'pppspspd1',
      }
      const asset2 = {
        name: 'bagger 1',
        description: 'fsdfksj',
        serialNumber: 'pppspspd2',
      }
      const asset3 = {
        name: 'bagger 3',
        description: 'fsdfksj',
        serialNumber: 'pppspspd3',
      }

      await request(app)
        .post('/assets')
        .send(asset1)
        .set('Cookie', authenticationCookie)

      await request(app)
        .post('/assets')
        .send(asset2)
        .set('Cookie', authenticationCookie)

      await request(app)
        .post('/assets')
        .send(asset3)
        .set('Cookie', authenticationCookie)

      const response = await request(app)
        .get('/assets/')
        .set('Cookie', authenticationCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBe(3)
    })
  })
  describe('findByIdAndUpdateAssetHandler endpoint', () => {
    it('should update and return an asset with new data', async () => {
      const id = '65453f5636cb1bfcf0b98722'
      const asset = {
        _id: id,
        name: 'bagger',
        description: 'fsdfksj',
        serialNumber: 'pppspspd',
      }
      const assetUpdated = {
        name: 'bagger',
        description: 'updated!',
        serialNumber: 'pppspspd',
      }

      await request(app)
        .post('/assets')
        .send(asset)
        .set('Cookie', authenticationCookie)

      const response = await request(app)
        .patch('/assets/' + id)
        .send(assetUpdated)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        name: 'bagger',
        description: 'updated!',
        serialNumber: 'pppspspd',
        _id: '65453f5636cb1bfcf0b98722',
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
    })
  })
  describe('deleteAssetHandler endpoint', () => {
    it('should delete the asset and return 204', async () => {
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

      const response = await request(app)
        .delete('/assets/' + id)
        .set('Cookie', authenticationCookie)
      expect(response.statusCode).toBe(204)
    })
  })
})
