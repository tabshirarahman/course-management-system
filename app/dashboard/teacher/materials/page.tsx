"use client"

import { useState } from "react"
import { CourseSelect } from "@/components/teacher/course-select"
import { MaterialUpload } from "@/components/teacher/material-upload"
import { MaterialList } from "@/components/teacher/material-list"

export default function MaterialsPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  function handleUploadSuccess() {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Materials</h1>
        <p className="text-muted-foreground">Upload and manage course materials</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Course</h3>
        <CourseSelect onSelect={setSelectedCourse} selectedId={selectedCourse} />
      </div>

      {selectedCourse && (
        <div className="grid md:grid-cols-2 gap-6">
          <MaterialUpload courseId={selectedCourse} onSuccess={handleUploadSuccess} />
          <MaterialList courseId={selectedCourse} refreshTrigger={refreshTrigger} />
        </div>
      )}

      {!selectedCourse && (
        <div className="text-center py-12 text-muted-foreground">Select a course to view and manage materials</div>
      )}
    </div>
  )
}
