import mongoose, { InferSchemaType, Schema, model } from 'mongoose'

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

export default model<Asset>('Asset', assetSchema)
