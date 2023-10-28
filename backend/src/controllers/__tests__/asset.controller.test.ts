import { findAssetsHandler } from '../asset.controller'
import { Request, Response, NextFunction } from 'express'
import AssetModel from '../../models/asset'

describe('findAssetsHandler function', () => {
  let responseObject: (typeof AssetModel)[] = []

  const next: NextFunction = jest.fn()

  const req: Request = {} as Request

  const res: Partial<Response> = {
    json: jest.fn().mockImplementation((result) => {
      responseObject = result
    }),
  }

  it('should return an empty array', () => {
    findAssetsHandler(req, res as Response, next)
    expect(responseObject).toEqual([]) // Check if responseObject is an empty array
  })
})
