"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCourseSchema } from "@/schemas/course";

interface AdminEditCourseFormProps {
  courseId: string;
  course: any;
}

export function AdminEditCourseForm({
  courseId,
  course,
}: AdminEditCourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price.toString(),
    image: course.image,
    status: course.status,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const validatedData = updateCourseSchema.parse({
        ...formData,
        price: Number.parseFloat(formData.price),
      });

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      setSuccess("Course updated successfully");
      setTimeout(() => {
        router.push(`/dashboard/admin/courses/${courseId}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      router.push("/dashboard/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Update course information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting this course will remove it from the system permanently. All
            associated materials and enrollments will also be deleted.
          </p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full"
          >
            Delete Course
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
