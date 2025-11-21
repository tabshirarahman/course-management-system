import { dbConnect } from "@/lib/db"
import { Material } from "@/models/material"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const material = await Material.findByIdAndDelete(params.id)

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Material deleted successfully" })
  } catch (error) {
    console.error("Delete material error:", error)
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 })
  }
}
