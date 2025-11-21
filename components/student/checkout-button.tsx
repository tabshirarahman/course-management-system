"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js";

interface CheckoutButtonProps {
  courseId: string
  courseName: string
  price: number
  disabled?: boolean
}

export function CheckoutButton({ courseId, courseName, price, disabled }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleCheckout() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          courseName,
          price,
        }),
      })

      if (!response.ok) throw new Error("Failed to create checkout session")

      const { sessionId } = await response.json()

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
          "pk_test_51SRNKEJnI4CzGPtHzSWFGAvaO3rYyuNf6JrugfbrDQ5viem8Pj6fGIMHV8HSTrs7zIhA0kA1YgpY62xSWg4emv0600OvfIArc9"
      );
      if (!stripe) throw new Error("Stripe failed to load")

      const { error } = await (stripe as any).redirectToCheckout({ sessionId })
      if (error) throw error
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (price === 0) {
    return (
      <Button size="sm" disabled={disabled || isLoading}>
        Free - Enroll
      </Button>
    )
  }

  return (
    <Button size="sm" onClick={handleCheckout} disabled={disabled || isLoading}>
      {isLoading ? "Loading..." : `Enroll - $${price}`}
    </Button>
  )
}
