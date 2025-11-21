"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StudentStats {
  enrolledCourses: number
  completedCourses: number
  totalProgress: number
}

interface Course {
  _id: string
  title: string
  progress: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalProgress: 0,
  })
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])

  useEffect(() => {
    fetchStudentData()
  }, [])

  async function fetchStudentData() {
    try {
      const enrollmentsRes = await fetch("/api/enrollments")
      if (!enrollmentsRes.ok) throw new Error("Failed to fetch enrollments")

      const enrollmentsData = await enrollmentsRes.json()
      const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : []

      const courses = enrollments.map((e: any) => ({
        _id: e.courseId?._id,
        title: e.courseId?.title,
        progress: e.progress || 0,
      }))

      const completed = enrollments.filter((e: any) => e.status === "completed").length
      const avgProgress =
        enrollments.length > 0
          ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / enrollments.length)
          : 0

      setStats({
        enrolledCourses: enrollments.length,
        completedCourses: completed,
        totalProgress: avgProgress,
      })
      setEnrolledCourses(courses)
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Continue learning</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enrolledCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {enrolledCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">{course.progress}%</p>
                    <Link href={`/dashboard/student/course/${course._id}`}>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {enrolledCourses.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">You haven't enrolled in any courses yet</p>
              <Link href="/dashboard/student/browse">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
