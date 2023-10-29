import mongoose, { InferSchemaType, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const assetSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    serialNumber: { type: String, required: true, unique: true },
    parts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part',
      },
    ],
  },
  { timestamps: true }
)

type Asset = InferSchemaType<typeof assetSchema>

assetSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export default model<Asset>('Asset', assetSchema)
