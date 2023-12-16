import mongoose, { InferSchemaType, Schema, model } from 'mongoose'

const taskSchema = new Schema(
  {
    name: String,
    description: String,
    plannedMaintenance: {
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

type Task = InferSchemaType<typeof taskSchema>

export default model<Task>('Task', taskSchema)
