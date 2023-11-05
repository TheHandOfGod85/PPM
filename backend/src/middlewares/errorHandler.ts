import { ErrorRequestHandler } from 'express'
import { isHttpError } from 'http-errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  let statusCode = 500
  let errorMessage = 'An unknown error occurred'
  if (isHttpError(err)) {
    statusCode = err.status
    errorMessage = err.message
  }
  if (err.name === 'ValidationError') {
    for (const field in err.errors) {
      const { kind, path, value } = err.errors[field]
      errorMessage = `${path} is ${kind}.`
    }
    statusCode = 400
  }
  // if (err.name === 'CastError') {
  //   for (const field in err.errors) {
  //     const { path } = err.errors[field]
  //     errorMessage = `${path} is not an ObjectId`
  //   }
  //   statusCode = 400
  // }

  res.status(statusCode).json({ errors: errorMessage })
}

export default errorHandler
