import { InferSchemaType, Query, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import PartModel from './part'
import env from '../env'
import fs from 'fs'

const assetSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    serialNumber: { type: String, required: true, unique: true },
    plannedMaintenance: {
      startDate: { type: String },
      interval: { type: Number },
      tasks: [
        {
          name: String,
          description: String,
        },
      ],
    },
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
  const parts = await PartModel.find({ asset: this._id })
  for (const part of parts) {
    // Delete the part's image if it exists and starts with the specified server URL
    if (part.imageUrl?.startsWith(env.SERVER_URL)) {
      const imagePath = part.imageUrl.split(env.SERVER_URL)[1].split('?')[0]
      fs.unlinkSync(`.${imagePath}`)
    }
  }
  await PartModel.deleteMany({ asset: this._id })
  next()
})
assetSchema.pre<Query<unknown, Asset>>(/^find/, function (next) {
  this.select('-__v')
  next()
})

export type Asset = InferSchemaType<typeof assetSchema>

assetSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export default model<Asset>('Asset', assetSchema)
