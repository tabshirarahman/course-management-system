"use client"

import { useEffect, useState } from "react"
import { CourseCard } from "@/components/student/course-card"

interface Course {
  _id: string
  title: string
  description: string
  category: string
  price: number
  image: string
  assignedTeacher: { name: string }
}

interface Enrollment {
  courseId: Course
}

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  async function fetchEnrolledCourses() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/enrollments")
      if (!response.ok) throw new Error("Failed to fetch enrollments")

      const data = await response.json()
      const enrollments = Array.isArray(data) ? data : []
      const courses = enrollments.map((e: Enrollment) => e.courseId).filter(Boolean)

      setCourses(courses)
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Courses you're currently enrolled in</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">You haven't enrolled in any courses yet</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} enrolled={true} />
          ))}
        </div>
      )}
    </div>
  )
}
