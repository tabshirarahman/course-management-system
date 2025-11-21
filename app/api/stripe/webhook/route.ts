import { stripe } from "@/lib/stripe"
import { dbConnect } from "@/lib/db"
import { Enrollment } from "@/models/enrollment"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")

    await dbConnect()

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any

      if (session.payment_status === "paid") {
        const courseId = session.metadata?.courseId
        const userId = session.metadata?.userId

        if (courseId && userId) {
          // Check if enrollment already exists
          const existing = await Enrollment.findOne({ userId, courseId })
          if (!existing) {
            await Enrollment.create({
              userId,
              courseId,
              paymentId: session.id,
              status: "active",
              progress: 0,
            })
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 })
  }
}
