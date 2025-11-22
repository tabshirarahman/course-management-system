import { z } from "zod"

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be at least 0"),
  image: z.string().url("Invalid image URL"),
  status: z.enum(["draft", "published"]).optional(),
});

export const updateCourseSchema = createCourseSchema.partial()

export const publishCourseSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  status: z.enum(["draft", "published"]),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
export type PublishCourseInput = z.infer<typeof publishCourseSchema>
