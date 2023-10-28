import { AssetDto } from '../../dto/dtos'
import { createAssetHandler } from '../asset.controller'
import { Request, Response, NextFunction } from 'express'

describe('createAssetHandler function', () => {
  let responseObject: unknown = {
    name: 'Bagger 2',
    description: 'Bagging salads',
    serialNumber: 'GS736GLLK£4',
    parts: [],
    _id: '653ce4177aaedaaba2ec3c6a',
    createdAt: '2023-10-28T10:36:07.913Z',
    updatedAt: '2023-10-28T10:36:07.913Z',
  }

  const next: NextFunction = jest.fn()

  const req: Request<unknown, unknown, AssetDto, unknown> = {
    body: {
      name: 'Bagger 1',
      description: 'Bagging salads',
      serialNumber: 'GS736GJJK£4',
    },
  } as unknown as Request

  const res: Partial<Response> = {
    json: jest.fn().mockImplementation((result) => {
      responseObject = result
    }),
    status: jest.fn().mockReturnThis(),
  }

  it('should return status 201 and a response body of the asset',  () => {
    createAssetHandler(req, res as Response, next)
    expect((res as Response).status(201)).toBe(res as Response)
    expect(responseObject).toEqual({
      name: 'Bagger 2',
      description: 'Bagging salads',
      serialNumber: 'GS736GLLK£4',
      parts: [],
      _id: '653ce4177aaedaaba2ec3c6a',
      createdAt: '2023-10-28T10:36:07.913Z',
      updatedAt: '2023-10-28T10:36:07.913Z',
    })
  })
})
