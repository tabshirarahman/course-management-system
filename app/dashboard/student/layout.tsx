"use client";

import type React from "react";

import { StudentSidebar } from "@/components/student/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card p-6">
        <h2 className="text-2xl font-bold text-primary mb-8">
          Academic Portal For Student
        </h2>
        <StudentSidebar />
        <Button
          variant="outline"
          className="w-full mt-8 bg-transparent"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
