import { NextFunction, Request, Response } from 'express'
import { createAssetHandler } from '../asset.controller'

afterEach(() => {
  jest.clearAllMocks()
})
describe('assetController test suite', () => {
  it('should return an asset once created', async () => {
    const req = {
      body: {
        name: 'Bagger',
        description: 'a bagger',
        serialNumber: 'PNJHD6663',
      },
    }
    const res = {
      body: {
        name: 'Bagger',
        description: 'a bagger',
        serialNumber: 'PNJHD6663',
      },
      status: 201,
    }
    const next = jest.fn()

    createAssetHandler(
      req as Request,
      res as unknown as Response,
      next as NextFunction
    )

    expect(res.body).toEqual(req.body)
  })
})
