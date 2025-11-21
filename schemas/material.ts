import { z } from "zod"

export const uploadMaterialSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  category: z.enum(["Lecture", "Lab", "Assignment", "Exam"]),
  week: z.number().min(1).max(52),
  courseId: z.string().min(1, "Course ID is required"),
})

export const materialFileSchema = z.object({
  fileUrl: z.string().url("Invalid file URL"),
  publicId: z.string().min(1),
  fileType: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
})

export type UploadMaterialInput = z.infer<typeof uploadMaterialSchema>
export type MaterialFile = z.infer<typeof materialFileSchema>
