import { InferSchemaType, Query, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import PartModel from './part'

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

assetSchema.pre('deleteOne', { document: true }, async function (next) {
  if (this._id) {
    await PartModel.deleteMany({ asset: this._id })
  }
  next()
})
assetSchema.pre<Query<unknown, Asset>>(/^find/, function (next) {
  this.select('-__v')
  next()
})

export type Asset = InferSchemaType<typeof assetSchema>

assetSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export default model<Asset>('Asset', assetSchema)
