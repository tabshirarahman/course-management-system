"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { CourseCard } from "./course-card"

interface Course {
  _id: string
  title: string
  description: string
  category: string
  price: number
  image: string
  assignedTeacher: { name: string }
}

interface CourseBrowserProps {
  enrolledCourseIds: string[]
  onEnroll: (courseId: string) => void
  enrollingId?: string
}

export function CourseBrowser({ enrolledCourseIds, onEnroll, enrollingId }: CourseBrowserProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    let filtered = courses.filter((course) => !enrolledCourseIds.includes(course._id))

    if (search) {
      filtered = filtered.filter((course) => course.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (category) {
      filtered = filtered.filter((course) => course.category === category)
    }

    setFilteredCourses(filtered)
  }, [courses, search, category, enrolledCourseIds])

  async function fetchCourses() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/courses?status=published")
      if (!response.ok) throw new Error("Failed to fetch courses")

      const data = await response.json()
      setCourses(data.courses || [])

      const uniqueCategories = [...new Set((data.courses || []).map((c: Course) => c.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Browse Courses</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No courses available. Try adjusting your filters.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} onEnroll={onEnroll} isLoading={enrollingId === course._id} />
          ))}
        </div>
      )}
    </div>
  )
}
