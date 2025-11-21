"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  courseId: string
  uploadedBy: string
  onUploadSuccess?: (data: UploadedFile) => void
  onUploadError?: (error: string) => void
}

interface UploadedFile {
  id: string
  fileName: string
  fileUrl: string
  publicId: string
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/zip",
  "video/mp4",
  "image/jpeg",
  "image/png",
]

export function FileUpload({ courseId, uploadedBy, onUploadSuccess, onUploadError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<UploadedFile | null>(null)

  // Validate file type
  const isValidFile = (file: File): boolean => {
    return ALLOWED_TYPES.includes(file.type)
  }

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    setSuccess(null)

    if (!isValidFile(file)) {
      setError("Invalid file type. Allowed: PDF, DOCX, PPT, ZIP, MP4, JPEG, PNG")
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit")
      return
    }

    setSelectedFile(file)
  }, [])

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("courseId", courseId)
      formData.append("uploadedBy", uploadedBy)
      formData.append("title", selectedFile.name)
      formData.append("category", "Lecture")
      formData.append("week", "1")

      const response = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData,
      })

      // Simulate progress
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30
        if (progress > 90) progress = 90
        setUploadProgress(Math.min(progress, 90))
      }, 100)

      if (!response.ok) {
        clearInterval(progressInterval)
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      clearInterval(progressInterval)
      setUploadProgress(100)

      setSuccess(data.data)
      setSelectedFile(null)
      onUploadSuccess?.(data.data)

      // Reset after 2 seconds
      setTimeout(() => {
        setSuccess(null)
        setUploadProgress(0)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      onUploadError?.(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone Card */}
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative p-8 border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/50"
        }`}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleInputChange}
          className="hidden"
          accept={ALLOWED_TYPES.join(",")}
          disabled={isUploading}
        />

        <label htmlFor="file-input" className="flex flex-col items-center justify-center gap-2 cursor-pointer">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {selectedFile ? selectedFile.name : "Drag and drop your file here"}
            </p>
            <p className="text-sm text-muted-foreground">or click to select (Max 100MB)</p>
          </div>
        </label>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            File uploaded successfully: {success.fileName}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && !success && (
        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="flex-1">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null)
              setError(null)
            }}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
