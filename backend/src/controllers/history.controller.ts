import { RequestHandler } from 'express'
import HistoryModel from '../models/history-maintenance'

export const findHistoryMaintenance: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const history = await HistoryModel.find()

    res.status(200).json(history)
  } catch (error) {
    next(error)
  }
}
