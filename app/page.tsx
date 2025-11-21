import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">CMS</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold text-foreground">
            Learn and Teach with
            <span className="text-primary"> CMS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete course management platform for instructors and students.
            Upload materials, manage courses, and track progress all in one
            place.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-base">
                Start for free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Students
            </h3>
            <p className="text-muted-foreground">
              Browse courses, enroll in classes, and access course materials
              anytime.
            </p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Teachers
            </h3>
            <p className="text-muted-foreground">
              Create courses, upload materials, and manage your students
              effectively.
            </p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Admins
            </h3>
            <p className="text-muted-foreground">
              Manage all courses, teachers, and students with powerful tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
