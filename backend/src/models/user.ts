import { InferSchemaType, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true, select: false },
    displayName: { type: String },
    about: { type: String },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

type User = InferSchemaType<typeof userSchema>
userSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })
export default model<User>('User', userSchema)
