"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeacherStats {
  assignedCourses: number
  totalMaterials: number
  totalEnrolledStudents: number
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats>({
    assignedCourses: 0,
    totalMaterials: 0,
    totalEnrolledStudents: 0,
  })

  useEffect(() => {
    // Fetch teacher stats
    async function fetchStats() {
      try {
        const coursesRes = await fetch("/api/courses?limit=1")
        const materialsRes = await fetch("/api/materials?limit=1")

        const coursesData = await coursesRes.json()
        const materialsData = await materialsRes.json()

        setStats({
          assignedCourses: coursesData.pagination?.total || 0,
          totalMaterials: materialsData.total || 0,
          totalEnrolledStudents: materialsData.enrolledStudents || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses and materials</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assignedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMaterials}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEnrolledStudents}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
