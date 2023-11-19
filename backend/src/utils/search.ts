import { FilterQuery, Model } from 'mongoose'
type QueryObject = Record<string, string>
export async function search(
  model: Model<unknown>,
  query: QueryObject,
  limit: number = 3,
  filter?: QueryObject
) {
  const page = parseInt(query.page || '1')
  const skip = (page - 1) * limit
  let totalItems: number = 0
  let result: FilterQuery<unknown> | undefined

  if (query.search && filter) {
    result = await model.aggregate([
      {
        $match: {
          $text: {
            $search: query.search,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        },
      },
      { $match: filter },
      { $skip: skip },
      { $limit: limit },
    ])
    totalItems = await model.countDocuments({
      $text: {
        $search: query.search,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    })
  } else if (filter) {
    result = await model.find(filter).skip(skip).limit(limit).sort('_id')
    totalItems = await model.countDocuments(filter)
  } else if (query.search) {
    result = await model
      .find({
        $text: {
          $search: query.search,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      })
      .skip(skip)
      .limit(limit)
    totalItems = await model.countDocuments({
      $text: {
        $search: query.search,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    })
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
