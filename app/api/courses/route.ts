import { dbConnect } from "@/lib/db"
import { Course } from "@/models/course"
import { createCourseSchema } from "@/schemas/course"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const teacherId = searchParams.get("teacherId");

    const query: any = {}
    if (status) query.status = status
    if (teacherId) query.assignedTeacher = teacherId;

    const courses = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("assignedTeacher", "name email")
      .sort({ createdAt: -1 })

    const total = await Course.countDocuments(query)

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get courses error:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const validatedData = createCourseSchema.parse(body)

     const teacherId = body.assignedTeacher;
    if (!teacherId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const course = await Course.create({
      ...validatedData,
      assignedTeacher: teacherId,
      modules: [],
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
