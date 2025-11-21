"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadMaterialSchema } from "@/schemas/material"

interface MaterialUploadProps {
  courseId: string
  onSuccess: () => void
}

export function MaterialUpload({ courseId, onSuccess }: MaterialUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Lecture" as const,
    week: "1",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const validMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "video/mp4",
    "image/jpeg",
    "image/png",
  ]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!validMimeTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, ZIP, MP4, JPEG, PNG")
      return
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB")
      return
    }

    setFile(selectedFile)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setError("")
    setIsLoading(true)
    setProgress(0)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      // Upload file to Cloudinary
      const uploadResponse = await fetch("/api/materials/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) throw new Error("Failed to upload file")

      const uploadedFile = await uploadResponse.json()

      // Validate and create material record
      const validatedData = uploadMaterialSchema.parse({
        ...formData,
        courseId,
        week: Number.parseInt(formData.week),
      })

      const materialResponse = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validatedData,
          fileUrl: uploadedFile.url,
          publicId: uploadedFile.publicId,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
        }),
      })

      if (!materialResponse.ok) throw new Error("Failed to save material")

      setFile(null)
      setFormData({ title: "", description: "", category: "Lecture", week: "1" })
      setProgress(100)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Material</CardTitle>
        <CardDescription>Add course materials for your students</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              placeholder="e.g., Lecture 1 - Introduction"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Material description (optional)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                disabled={isLoading}
              >
                <option>Lecture</option>
                <option>Lab</option>
                <option>Assignment</option>
                <option>Exam</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Week</label>
              <Input
                type="number"
                min="1"
                max="52"
                value={formData.week}
                onChange={(e) => setFormData({ ...formData, week: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.jpg,.jpeg,.png"
                className="w-full"
              />
              {file && <p className="text-sm text-muted-foreground mt-2">{file.name}</p>}
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Material"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
