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
  beforeEach(async () => {
    // Set the authentication cookie before each test
    await request(app).post('/user/signup').send(signupCredentials)
    const loggedInUser = await request(app)
      .post('/user/login')
      .send(loginCredentials)
    authenticationCookie = loggedInUser.header['set-cookie']
  })
  afterAll(disconnect)
  describe('createPartHandler endpoint', () => {
    it('should return a created part with no image', async () => {
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
    it('should return a created part with an imageUrl', async () => {
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
      const imageFilePath = 'B:/nextjs/PPM/backend/images/no-image.jpg'
      const response = await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .field('name', part.name)
        .field('description', part.description)
        .field('partNumber', part.partNumber)
        .field('manufacturer', part.manufacturer)
        .attach('partImage', imageFilePath) // Attach the image file
      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        _id: expect.anything(),
        id: expect.anything(),
        asset: expect.anything(),
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd',
        manufacturer: 'Mozzi',
        imageUrl: expect.any(String),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })
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

      const response2 = await request(app).get('/assets/' + id)
      expect(response2.statusCode).toBe(200)

      const part = {
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd',
        manufacturer: 'Mozzi',
      }
      const partReturned = await request(app)
        .post('/assets/' + id + '/part')
        .set('Cookie', authenticationCookie)
        .send(part)
      const response = await request(app).get('/part/' + partReturned.body._id)
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        name: 'bearing',
        description: 'fsdfksj',
        partNumber: 'pppspspd',
        manufacturer: 'Mozzi',
        _id: expect.anything(),
        id: expect.anything(),
        asset: expect.anything(),
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
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

        const response2 = await request(app).get('/assets/' + id)
        expect(response2.statusCode).toBe(200)
        const part = {
          name: 'bearing',
          description: 'fsdfksj',
          partNumber: 'pppspspd',
          manufacturer: 'Mozzi',
        }
        const partReturned = await request(app)
          .post('/assets/' + id + '/part')
          .set('Cookie', authenticationCookie)
          .send(part)
        const part2 = {
          name: 'bearing 9',
          description: 'fsdfksj',
          partNumber: 'pppspspd',
          manufacturer: 'Mozzi',
        }
        const response = await request(app)
          .patch('/part/' + partReturned.body._id)
          .set('Cookie', authenticationCookie)
          .send(part2)
        expect(response.statusCode).toBe(200)
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
          const part = {
            name: 'bearing',
            description: 'fsdfksj',
            partNumber: 'pppspspd3',
            manufacturer: 'Mozzi',
          }
          const partReturned = await request(app)
            .post('/assets/' + id + '/part')
            .set('Cookie', authenticationCookie)
            .send(part)
          const response = await request(app)
            .delete('/part/' + partReturned.body._id)
            .set('Cookie', authenticationCookie)
          expect(response.statusCode).toBe(204)
        })
      })
    })
  })
})
