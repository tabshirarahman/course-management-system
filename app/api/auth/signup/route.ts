
import { hashPassword, generateToken } from "@/lib/auth"
import { User } from "@/models/user"
import { signUpSchema } from "@/schemas/auth"
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const validatedData = signUpSchema.parse(body)

    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
    })
    console.log("🚀 ~ POST ~ user:", user)

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      role: user.role,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
