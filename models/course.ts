import mongoose, { Schema, Types, type Document } from "mongoose"

export interface ICourse {
  _id?: string;
  title: string
  description: string
  category: string
  price: number
  image: string
  assignedTeacher: mongoose.Types.ObjectId
  modules: Array<{
    week: number
    title: string
  }>
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    assignedTeacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modules: [
      {
        week: Number,
        title: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
)

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)
