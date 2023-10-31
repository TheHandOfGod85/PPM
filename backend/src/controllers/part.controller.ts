import { PartBody } from './../validation/part.validator'
// import createHttpError from 'http-errors'
import { RequestHandler } from 'express'
import PartModel from '../models/part'

export const createPartHandler: RequestHandler<
  unknown,
  unknown,
  PartBody,
  unknown
> = async (req, res, next) => {
  try {
    const newPart = await await PartModel.create(req.body)
    res.status(201).json(newPart)
  } catch (error) {
    next(error)
  }
}

export const findPartsHandler: RequestHandler = async (req, res, next) => {
  try {
    const allParts = await PartModel.find()
    res.status(200).json(allParts)
  } catch (error) {
    next(error)
  }
}
