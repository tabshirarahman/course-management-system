import { z } from "zod"

export const createCheckoutSessionSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  courseName: z.string().min(1, "Course name is required"),
  price: z.number().min(0, "Price must be at least 0"),
})

export const webhookEventSchema = z.object({
  id: z.string(),
  object: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      client_reference_id: z.string().optional(),
      payment_status: z.string(),
      metadata: z
        .object({
          courseId: z.string().optional(),
          userId: z.string().optional(),
        })
        .optional(),
    }),
  }),
})

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>
