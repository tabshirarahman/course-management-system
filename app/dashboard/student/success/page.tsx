"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (sessionId) {
      verifyPayment(sessionId)
    }
  }, [searchParams])

  async function verifyPayment(sessionId: string) {
    try {
      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        setSuccess(true)
      }
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isVerifying ? "Processing..." : success ? "Enrollment Successful!" : "Payment Failed"}</CardTitle>
          <CardDescription>
            {isVerifying
              ? "Verifying your payment..."
              : success
                ? "You have been enrolled in the course"
                : "Something went wrong. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerifying && (
            <Button className="w-full" onClick={() => router.push("/dashboard/student/enrolled")}>
              {success ? "View My Courses" : "Back to Browse"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
