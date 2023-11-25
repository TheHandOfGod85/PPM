import mongoose, { InferSchemaType, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const tokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'user',
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tokenSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export type Token = InferSchemaType<typeof tokenSchema>

export default model<Token>('Token', tokenSchema)
