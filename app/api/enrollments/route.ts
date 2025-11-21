import { dbConnect } from "@/lib/db"
import { Enrollment } from "@/models/enrollment"
import { Course } from "@/models/course"
import { enrollCourseSchema } from "@/schemas/enrollment"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const enrollments = await Enrollment.find({ userId })
      .populate("courseId")
      .populate("userId", "name email")
      .sort({ enrolledAt: -1 })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Get enrollments error:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = enrollCourseSchema.parse(body)

    // Check if course exists
    const course = await Course.findById(validatedData.courseId)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      userId,
      courseId: validatedData.courseId,
    })

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    const enrollment = await Enrollment.create({
      userId,
      ...validatedData,
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Create enrollment error:", error)
    return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 })
  }
}
