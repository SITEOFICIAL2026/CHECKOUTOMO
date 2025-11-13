import { NextResponse } from "next/server"

// In production, you would query your database or payment provider
export async function GET() {
  return NextResponse.json({
    paid: false,
    status: "pending",
  })
}
