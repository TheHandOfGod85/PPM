import { ErrorRequestHandler } from 'express'
import { isHttpError } from 'http-errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  let statusCode = 500
  let errorMessage =
    err.name === 'ValidationError' ? [] : ['An unknown error occurred']
  if (isHttpError(err)) {
    statusCode = err.status
    errorMessage.push(err.message)
  }
  if (err.name === 'ValidationError') {
    for (const field in err.errors) {
      const { kind, path, value } = err.errors[field]
      errorMessage.push(`${path} is ${kind}.`)
    }
    statusCode = 400
  }
  if (err.name === 'CastError') {
    statusCode = 400
    errorMessage[0] = 'Not a valid id'
  }

  res.status(statusCode).json({ errors: errorMessage })
}

export default errorHandler
