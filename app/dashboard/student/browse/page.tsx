"use client"

import { useState, useEffect } from "react"
import { CourseBrowser } from "@/components/student/course-browser"

export default function BrowseCoursesPage() {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
  const [enrollingId, setEnrollingId] = useState<string>()

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  async function fetchEnrolledCourses() {
    try {
      const response = await fetch("/api/enrollments")
      if (!response.ok) throw new Error("Failed to fetch enrollments")

      const data = await response.json()
      const ids = (Array.isArray(data) ? data : []).map((e: any) => e.courseId?._id)
      setEnrolledCourseIds(ids.filter(Boolean))
    } catch (error) {
      console.error("Error fetching enrollments:", error)
    }
  }

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId)

    try {
      // For now, create enrollment without payment
      // This will be integrated with Stripe in the next task
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          paymentId: "free-" + Date.now(),
        }),
      })

      if (!response.ok) throw new Error("Failed to enroll")

      setEnrolledCourseIds([...enrolledCourseIds, courseId])
      alert("Successfully enrolled in course!")
    } catch (error) {
      console.error("Error enrolling:", error)
      alert("Failed to enroll. Please try again.")
    } finally {
      setEnrollingId(undefined)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse Courses</h1>
        <p className="text-muted-foreground">Explore and enroll in courses</p>
      </div>

      <CourseBrowser enrolledCourseIds={enrolledCourseIds} onEnroll={handleEnroll} enrollingId={enrollingId} />
    </div>
  )
}
