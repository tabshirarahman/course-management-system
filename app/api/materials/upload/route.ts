import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary, isValidMimeType } from "@/lib/cloudinary"
import { uploadMaterialSchema } from "@/schemas/material"
import { Material } from "@/models/material"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const week = Number(formData.get("week"))
    const courseId = formData.get("courseId") as string
    const uploadedBy = formData.get("uploadedBy") as string

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file MIME type
    if (!isValidMimeType(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: PDF, DOCX, PPT, ZIP, MP4, JPEG, PNG`,
        },
        { status: 400 },
      )
    }

    // Validate file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 })
    }

    // Validate material metadata
    const validationResult = uploadMaterialSchema.safeParse({
      title,
      description,
      category,
      week,
      courseId,
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid material metadata", details: validationResult.error }, { status: 400 })
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, `courses/${courseId}`)

    // Save material metadata to MongoDB
    const material = new Material({
      courseId,
      title,
      description,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileType: uploadResult.fileType,
      fileName: file.name,
      fileSize: file.size,
      category,
      week,
      uploadedBy,
    })

    await material.save()

    return NextResponse.json(
      {
        success: true,
        data: {
          id: material._id,
          fileUrl: material.fileUrl,
          publicId: material.publicId,
          fileName: material.fileName,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
