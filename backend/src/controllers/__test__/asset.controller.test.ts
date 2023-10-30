import { NextFunction, Request, Response } from 'express'
import { createAssetHandler } from '../asset.controller'
describe('assetController test suite', () => {
  it('should return an asset once created', async () => {
    const req = {
      body: {
        name: 'Bagger',
        description: 'a bagger',
        serialNumber: 'PNJHD6663',
      },
    }
    const res = jest.fn()
    const next = jest.fn()

    const actual: any = createAssetHandler(
      req as unknown as Request,
      res as unknown as Response,
      next as NextFunction
    )

    expect(req.body).toEqual(actual)
  })
})
