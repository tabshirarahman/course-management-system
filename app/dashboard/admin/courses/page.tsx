"use client"

import { CourseTable } from "@/components/admin/course-table"

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <p className="text-muted-foreground">Create and manage all courses</p>
      </div>

      <CourseTable />
    </div>
  )
}
