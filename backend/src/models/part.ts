import { InferSchemaType, Schema, model } from 'mongoose'

const partSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    manufacturer: { type: String, required: true },
    partNumber: { type: String, unique: true },
  },
  { timestamps: true }
)
type Part = InferSchemaType<typeof partSchema>

export default model<Part>('Part', partSchema)
