import { stripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        courseId: session.metadata?.courseId,
      })
    }

    return NextResponse.json({ success: false }, { status: 400 })
  } catch (error) {
    console.error("Verify session error:", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}
