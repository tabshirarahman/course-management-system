"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseDetail {
  _id: string
  title: string
  description: string
  category: string
  price: number
  image: string
  assignedTeacher: { name: string }
  modules: Array<{ week: number; title: string }>
}

interface Material {
  _id: string
  title: string
  category: string
  week: number
  fileName: string
  fileUrl: string
}

interface CoursePageProps {
  params: { id: string }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [params.id])

  async function fetchCourseData() {
    try {
      setIsLoading(true)
      const [courseRes, materialsRes] = await Promise.all([
        fetch(`/api/courses/${params.id}`),
        fetch(`/api/materials?courseId=${params.id}`),
      ])

      if (courseRes.ok) {
        const courseData = await courseRes.json()
        setCourse(courseData)
      }

      if (materialsRes.ok) {
        const materialsData = await materialsRes.json()
        setMaterials(materialsData.materials || [])
      }
    } catch (error) {
      console.error("Error fetching course data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading course...</div>
  }

  if (!course) {
    return <div className="text-center py-12 text-muted-foreground">Course not found</div>
  }

  const materialsByWeek = materials.reduce(
    (acc, material) => {
      if (!acc[material.week]) acc[material.week] = []
      acc[material.week].push(material)
      return acc
    },
    {} as Record<number, Material[]>,
  )

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.category}</p>
          <p className="text-muted-foreground mt-1">Instructor: {course.assignedTeacher.name}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">${course.price}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{course.description}</p>
        </CardContent>
      </Card>

      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Materials</CardTitle>
            <CardDescription>Organized by week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(materialsByWeek)
              .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
              .map(([week, weekMaterials]) => (
                <div key={week}>
                  <h3 className="font-semibold mb-3">Week {week}</h3>
                  <div className="space-y-2 ml-4">
                    {weekMaterials.map((material) => (
                      <div
                        key={material._id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{material.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.category} • {material.fileName}
                          </p>
                        </div>
                        <a
                          href={material.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {materials.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No materials available yet. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
