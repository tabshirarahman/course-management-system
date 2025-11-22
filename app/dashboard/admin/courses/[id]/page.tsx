import { dbConnect } from "@/lib/db";
import { Course } from "@/models/course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCoursePage({
  params,
}: AdminCoursePageProps) {
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
          <Link href="/dashboard/admin/courses">
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
          <Link href="/dashboard/admin/courses">
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
            <div className="grid md:grid-cols-3 gap-4">
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned Teacher
                </p>
                <p className="text-foreground">
                  {course.assignedTeacher?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.assignedTeacher?.email}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Image URL
              </p>
              <p className="text-sm text-foreground break-all">
                {course.image}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link href={`/dashboard/admin/courses/${id}/edit`}>
            <Button>Edit Course</Button>
          </Link>
          <Link href={`/dashboard/admin/materials?courseId=${id}`}>
            <Button variant="outline">View Materials</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className="space-y-6">
        <Link href="/dashboard/admin/courses">
          <Button variant="outline">← Back to Courses</Button>
        </Link>
        <div className="text-center py-12 text-destructive">
          Failed to load course
        </div>
      </div>
    );
  }
}
