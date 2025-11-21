import mongoose, { Schema, type Document } from "mongoose"

interface IMaterial extends Document {
  courseId: mongoose.Types.ObjectId
  title: string
  description?: string
  fileUrl: string
  publicId: string
  fileType: string
  fileName: string
  fileSize: number
  category: "Lecture" | "Lab" | "Assignment" | "Exam"
  week: number
  uploadedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const materialSchema = new Schema<IMaterial>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx", "ppt", "zip", "video", "image", "file"],
      default: "file",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Lecture", "Lab", "Assignment", "Exam"],
      required: true,
    },
    week: {
      type: Number,
      min: 1,
      max: 52,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
)

export const Material = mongoose.models.Material || mongoose.model<IMaterial>("Material", materialSchema)
