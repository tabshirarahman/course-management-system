import { z } from "zod"

export const enrollCourseSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  paymentId: z.string().min(1, "Payment ID is required"),
})

export const updateProgressSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment ID is required"),
  progress: z.number().min(0).max(100),
})

export type EnrollCourseInput = z.infer<typeof enrollCourseSchema>
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>
