import { InferSchemaType, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
})

tokenSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export type Token = InferSchemaType<typeof tokenSchema>

export default model<Token>('Token', tokenSchema)
