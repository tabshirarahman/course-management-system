import mongoose, { Schema, type Document } from "mongoose"

export interface IEnrollment extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  paymentId: string
  enrolledAt: Date
  status: "active" | "completed" | "cancelled"
  progress: number
  createdAt: Date
  updatedAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    paymentId: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
)

// Ensure unique enrollment per user per course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema)
