import { type NextRequest, NextResponse } from "next/server"

const PAYEVO_SECRET_KEY = process.env.PAYEVO_SECRET_KEY || "sk_like_LyBSODz8xxK4EwCrTAtIhZHiMeQUgMFebC7bGS9hDpPS9sSc"
const COMPANY_ID = process.env.COMPANY_ID || "b9594bbb-08b1-4392-b92d-61b1a90c5ea5"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const amountInReais = body.amount || 19.9
    const amountInCents = Math.round(amountInReais * 100)

    const auth = Buffer.from(`${PAYEVO_SECRET_KEY}:`).toString("base64")

    const response = await fetch("https://apiv2.payevo.com.br/functions/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        paymentMethod: "PIX",
        pix: {
          expiresInDays: 1,
        },
        customer: {
          document: {
            type: "CPF",
            number: "00000000191",
          },
        },
        items: [
          {
            title: "Pagamento PIX",
            unitPrice: amountInCents,
            quantity: 1,
            externalRef: `order-${Date.now()}`,
          },
        ],
        amount: amountInCents,
        description: "Pagamento Transparente PIX",
        postbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pix/webhook`,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Payevo API error:", error)
      return NextResponse.json({ error: "Falha ao criar transação PIX" }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Transaction created:", data.id)

    const qrCodeData = data.pix?.qrcode || data.pix?.brCode || ""

    return NextResponse.json(
      {
        qr_code: qrCodeData,
        id: data.id,
        status: "pending",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in PIX route:", error)
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 })
  }
}
