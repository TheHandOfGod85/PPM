import { Request, Response, NextFunction } from 'express'
import { findAssetsHandler } from '../asset.controller'
import AssetModel from '../../models/asset'

describe('findAssetsHandler test suite', () => {
  it('should return a list of assets', async () => {
    // Mock the find function of AssetModel to return some sample assets
    const mockAssets = [
      {
        name: 'Asset 1',
        description: 'Description 1',
        serialNumber: 'PHjdshs99',
      },
      {
        name: 'Asset 2',
        description: 'Description 2',
        serialNumber: 'PHrewhs99',
      },
    ]
    // Mock the response and request objects
    const req = {} as Request
    const res = {
      status: 200,
      json: mockAssets,
    } as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    AssetModel.find = jest.fn().mockResolvedValue(mockAssets)

    // Call the handler function
    await findAssetsHandler(req, res, next)

    // Expectations
    expect(res.status).toBe(200)
    expect(res.json).toEqual(mockAssets)
    expect(AssetModel.find).toHaveBeenCalledTimes(1)
  })
})
