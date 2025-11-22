import { dbConnect } from "@/lib/db";
import { Course } from "@/models/course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminEditCourseForm } from "@/components/admin/admin-edit-course-form"; 

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCoursePage({
  params,
}: EditCoursePageProps) {
  const { id } = await params;

  try {
    await dbConnect();
    const course = await Course.findById(id);

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
      <div className="space-y-6 max-w-2xl">
        <div>
          <Link href={`/dashboard/admin/courses/${id}`}>
            <Button variant="outline">← Back to Course</Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
          <p className="text-muted-foreground">
            Update course details and settings
          </p>
        </div>

        <AdminEditCourseForm courseId={id} course={course} />
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    return (
      <div className="text-center py-12 text-destructive">
        Failed to load course
      </div>
    );
  }
}
