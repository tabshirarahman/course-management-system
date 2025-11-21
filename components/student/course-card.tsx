"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckoutButton } from "./checkout-button"

interface CourseCardProps {
  course: {
    _id: string
    title: string
    description: string
    category: string
    price: number
    image: string
    assignedTeacher: { name: string }
  }
  enrolled?: boolean
  onEnroll?: (courseId: string) => void
  isLoading?: boolean
}

export function CourseCard({ course, enrolled, onEnroll, isLoading }: CourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-muted">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="text-xs mt-1">{course.category}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        <p className="text-xs text-muted-foreground mt-2">Instructor: {course.assignedTeacher.name}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 pt-4 border-t">
        <div className="text-lg font-bold text-primary">${course.price}</div>
        {enrolled ? (
          <Link href={`/dashboard/student/course/${course._id}`}>
            <Button variant="outline" size="sm">
              View Course
            </Button>
          </Link>
        ) : (
          <CheckoutButton courseId={course._id} courseName={course.title} price={course.price} disabled={isLoading} />
        )}
      </CardFooter>
    </Card>
  )
}
