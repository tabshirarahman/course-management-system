import { dbConnect } from "@/lib/db";
import { Course } from "@/models/course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCourseForm } from "@/components/edit-course-form";

interface TeacherCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherCoursePage({
  params,
}: TeacherCoursePageProps) {
  const { id } = await params;

  try {
    await dbConnect();

    const course = await Course.findById(id).populate(
      "assignedTeacher",
      "name email"
    );

    if (!course) {
      return (
        <div className="space-y-6">
          <Link href="/dashboard/teacher/courses">
            <Button variant="outline">← Back to Courses</Button>
          </Link>
          <div className="text-center py-12 text-muted-foreground">
            Course not found
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/teacher/courses">
            <Button variant="outline">← Back to Courses</Button>
          </Link>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.category}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-foreground">{course.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Price
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${course.price}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="text-foreground">{course.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <EditCourseForm courseId={id} />

        <div className="flex gap-2">
          <Link href={`/dashboard/teacher/materials?courseId=${id}`}>
            <Button>Manage Materials</Button>
          </Link>
          <Link href={`/dashboard/teacher/courses/${id}/edit`}>
            <Button variant="outline">Edit Course</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className="space-y-6">
        <Link href="/dashboard/teacher/courses">
          <Button variant="outline">← Back to Courses</Button>
        </Link>
        <div className="text-center py-12 text-destructive">
          Failed to load course
        </div>
      </div>
    );
  }
}
