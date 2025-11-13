import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] PIX Webhook received:", {
      transactionId: body.data.id,
      status: body.data.status,
      amount: body.data.amount,
    })

    // Example: Update order status in your database
    // await db.orders.update({
    //   where: { pixTransactionId: body.data.id },
    //   data: { status: body.data.status }
    // })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 })
  }
}
