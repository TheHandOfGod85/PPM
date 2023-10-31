import mongoose, { InferSchemaType, Query, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const partSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    manufacturer: { type: String, required: true },
    partNumber: { type: String, required: true, unique: true },
    asset: {
      type: mongoose.Schema.ObjectId,
      ref: 'Asset',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

partSchema.pre<Query<unknown, Part>>(/^find/, function (next) {
  this.select('-__v').populate({
    path: 'asset',
    select: ['name', 'serialNumber', 'description'],
  })
  next()
})

type Part = InferSchemaType<typeof partSchema>

partSchema.plugin(uniqueValidator, { message: 'Expected to be unique.' })

export default model<Part>('Part', partSchema)
