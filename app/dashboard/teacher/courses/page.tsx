"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/student/course-card";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  assignedTeacher: { name: string };
}

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Extract user ID from cookie or session
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.userId);
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchTeacherCourses();
  }, [userId]);

  async function fetchTeacherCourses() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses?teacherId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground">Manage your assigned courses</p>
        </div>
        <Link href="/dashboard/admin/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          You haven't been assigned any courses yet
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} enrolled={true} />
          ))}
        </div>
      )}
    </div>
  );
}
