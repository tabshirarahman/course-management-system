import { dbConnect } from "@/lib/db"
import { Material } from "@/models/material"
import { uploadMaterialSchema } from "@/schemas/material"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    const materials = await Material.find({ courseId }).sort({ week: 1, createdAt: -1 })

    return NextResponse.json({
      materials,
      total: materials.length,
    })
  } catch (error) {
    console.error("Get materials error:", error)
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const uploadedBy = request.headers.get("x-user-id")

    if (!uploadedBy) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const validatedData = uploadMaterialSchema.parse(body)

    const material = await Material.create({
      ...validatedData,
      uploadedBy,
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error("Create material error:", error)
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 })
  }
}
