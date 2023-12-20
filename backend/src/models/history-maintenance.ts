import { InferSchemaType, Schema, model } from 'mongoose'

const historySchema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    completedDate: { type: Date, default: Date.now },
    completedTasks: [
      {
        name: String,
        description: String,
        completed: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export type History = InferSchemaType<typeof historySchema>

export default model<History>('History', historySchema)
