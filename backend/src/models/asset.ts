import { InferSchemaType, Query, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const assetSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    serialNumber: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

assetSchema.virtual('parts', {
  ref: 'Part',
  localField: '_id',
  foreignField: 'asset',
})
assetSchema.pre<Query<unknown, Asset>>(/^find/, function (next) {
  this.select('-__v')
  next()
})

type Asset = InferSchemaType<typeof assetSchema>

assetSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export default model<Asset>('Asset', assetSchema)
