import { FilterQuery, Model, PipelineStage } from 'mongoose'
type QueryObject = Record<string, string>
export async function search(
  model: Model<unknown>,
  query: QueryObject,
  limit: number = 3,
  filter?: QueryObject
) {
  const paths = Object.keys(model.schema.paths)
  const filteredPaths = paths.filter((path) => path !== '_id')
  const page = parseInt(query.page || '1')
  const skip = (page - 1) * limit
  let totalItems: number = 0
  let result: FilterQuery<unknown> | undefined

  const pipeline: PipelineStage[] = [
    { $skip: skip },
    { $limit: limit },
    // { $sort: { _id: -1 } },
  ]

  if (query.search) {
    const orExpression = filteredPaths.map((path) => ({
      [path]: { $regex: query.search, $options: 'i' },
    }))
    if (filter) {
      pipeline.unshift({
        $match: filter,
      })
    }
    pipeline.splice(1, 0, {
      $match: {
        $or: orExpression,
      },
    })
    result = await model.aggregate(pipeline)
    totalItems = result.length
  } else if (filter) {
    result = await model.find(filter).skip(skip).limit(limit).sort('_id')
    totalItems = await model.countDocuments(filter)
  } else {
    result = await model.find().skip(skip).limit(limit).sort('_id')
    totalItems = await model.countDocuments()
  }

  return {
    result,
    page,
    totalpages: Math.ceil(totalItems / limit),
  }
}
