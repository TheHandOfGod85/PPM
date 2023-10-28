import { findAssetsHandler } from '../asset.controller'
import { Request, Response, NextFunction } from 'express'
jest.useFakeTimers()

describe('findAssetsHandler function', () => {
  let responseObject: unknown[] = []

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

describe('findAssetsHandler function', () => {
  let responseObject: unknown[] = [
    {
      _id: '653bee4e9a1af25d12c2a31f',
      name: 'Bagger 1',
      description: 'Bagging salads',
      serialNumber: 'GS736GJJK£4',
      parts: [],
      createdAt: '2023-10-27T17:07:26.991Z',
      updatedAt: '2023-10-27T17:07:26.991Z',
    },
  ]

  const next: NextFunction = jest.fn()

  const req: Request = {} as Request

  const res: Partial<Response> = {
    json: jest.fn().mockImplementation((result) => {
      responseObject = result
    }),
  }
  it('should return an asset', () => {
    findAssetsHandler(req, res as Response, next)
    expect(responseObject).toEqual([
      {
        _id: '653bee4e9a1af25d12c2a31f',
        name: 'Bagger 1',
        description: 'Bagging salads',
        serialNumber: 'GS736GJJK£4',
        parts: [],
        createdAt: '2023-10-27T17:07:26.991Z',
        updatedAt: '2023-10-27T17:07:26.991Z',
      },
    ])
  })
})
