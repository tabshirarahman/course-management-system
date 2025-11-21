"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Material {
  _id: string
  title: string
  category: string
  week: number
  fileName: string
  fileSize: number
  createdAt: string
}

interface MaterialListProps {
  courseId: string
  refreshTrigger?: number
}

export function MaterialList({ courseId, refreshTrigger }: MaterialListProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMaterials()
  }, [courseId, refreshTrigger])

  async function fetchMaterials() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/materials?courseId=${courseId}`)
      if (!response.ok) throw new Error("Failed to fetch materials")

      const data = await response.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error("Error fetching materials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteMaterial(materialId: string) {
    if (!window.confirm("Delete this material?")) return

    try {
      const response = await fetch(`/api/materials/${materialId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete material")

      setMaterials(materials.filter((m) => m._id !== materialId))
    } catch (error) {
      console.error("Error deleting material:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading materials...</div>
  }

  if (materials.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No materials uploaded yet</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Materials</CardTitle>
        <CardDescription>All materials for this course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {materials.map((material) => (
            <div
              key={material._id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <h4 className="font-medium">{material.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Week {material.week} • {material.category} • {material.fileName}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteMaterial(material._id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
