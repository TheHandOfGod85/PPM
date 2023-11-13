import { FilterQuery } from 'mongoose'

type QueryParams = Record<string, string>
type Filter = Record<string, string> | undefined

export class APIfeatures {
  query: FilterQuery<unknown>
  queryString: QueryParams
  page: number
  pageSize: number = 3
  filter?: Filter
  constructor(
    query: FilterQuery<unknown>,
    queryString: QueryParams,
    filter?: Filter
  ) {
    this.query = query
    this.queryString = queryString
    this.page = parseInt(queryString.page || '1')
    this.filter = filter
  }
  filtering() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    if (this.filter) {
      const mergedFilter = {
        ...this.filter,
        ...JSON.parse(queryStr),
      }
      this.query = this.query.find(mergedFilter)
    } else {
      this.query = this.query.find(JSON.parse(queryStr))
    }

    return this
  }

  paginate() {
    const page: number = Number(this.queryString.page) * 1 || 1
    // const limit: number = Number(3) * 1 || 100
    const skip = (page - 1) * this.pageSize

    this.query = this.query.skip(skip).limit(this.pageSize)

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }
}
