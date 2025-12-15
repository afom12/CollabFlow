import { signUp } from "@/lib/actions/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const result = await signUp(formData)

  if (result.error) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result, { status: 201 })
}

