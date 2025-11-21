"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Course {
  _id: string
  title: string
  category: string
  price: number
  status: "draft" | "published"
  assignedTeacher: { name: string; email: string }
  createdAt: string
}

export function CourseTable() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchCourses()
  }, [page, search])

  async function fetchCourses() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      const response = await fetch(`/api/courses?${params}`)
      if (!response.ok) throw new Error("Failed to fetch courses")

      const data = await response.json()
      setCourses(data.courses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCourse(courseId: string) {
    if (!window.confirm("Are you sure you want to delete this course?")) return

    try {
      const response = await fetch(`/api/courses/${courseId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete course")

      setCourses(courses.filter((c) => c._id !== courseId))
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>Manage all courses in the system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <Link href="/dashboard/admin/courses/new">
            <Button>Add Course</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No courses found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Teacher</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">{course.title}</td>
                    <td className="py-3">{course.category}</td>
                    <td className="py-3">${course.price}</td>
                    <td className="py-3">{course.assignedTeacher.name}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 space-x-2">
                      <Link href={`/dashboard/admin/courses/${course._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => deleteCourse(course._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
