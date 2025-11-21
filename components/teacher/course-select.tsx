"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Course {
  _id: string
  title: string
}

interface CourseSelectProps {
  onSelect: (courseId: string) => void
  selectedId?: string
}

export function CourseSelect({ onSelect, selectedId }: CourseSelectProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) throw new Error("Failed to fetch courses")

        const data = await response.json()
        setCourses(data.courses || [])
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {courses.map((course) => (
        <Button
          key={course._id}
          variant={selectedId === course._id ? "default" : "outline"}
          onClick={() => onSelect(course._id)}
          size="sm"
        >
          {course.title}
        </Button>
      ))}
    </div>
  )
}
