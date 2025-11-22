"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EditCourseFormProps {
  courseId: string;
}

export function EditCourseForm({ courseId }: EditCourseFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      window.location.href = "/dashboard/teacher/courses";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Deleting..." : "Delete Course"}
        </Button>
      </CardContent>
    </Card>
  );
}
