"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PaymentStageProps {
  qrCode: string
  transactionId: string | null
  amount: number
  onNewPayment: () => void
}

export function PaymentStage({ qrCode, transactionId, amount, onNewPayment }: PaymentStageProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isValidImage =
    qrCode &&
    (qrCode.startsWith("data:") ||
      qrCode.startsWith("http://") ||
      qrCode.startsWith("https://") ||
      /^[A-Za-z0-9+/=]+$/.test(qrCode))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 border-0 shadow-md bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escaneie o QR Code</h2>
        <p className="text-gray-600 mb-8">Escaneie o QR Code abaixo para realizar o pagamento:</p>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 flex justify-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {isValidImage && qrCode.startsWith("data:") ? (
              <img src={qrCode || "/placeholder.svg"} alt="PIX QR Code" className="w-72 h-72 object-contain" />
            ) : isValidImage && (qrCode.startsWith("http://") || qrCode.startsWith("https://")) ? (
              <img src={qrCode || "/placeholder.svg"} alt="PIX QR Code" className="w-72 h-72 object-contain" />
            ) : (
              <div className="w-72 h-72 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500 text-sm">QR Code não disponível</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-gray-700">Código PIX (copiar e colar)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrCode || "Gerando QR Code..."}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-mono"
            />
            <Button onClick={copyToClipboard} variant="outline" className="px-4 bg-transparent" disabled={!qrCode}>
              {copied ? "✓ Copiado" : "Copiar"}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-700">Aguardando confirmação do pagamento…</p>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor</span>
            <span className="text-3xl font-bold text-[#0056B3]">R$ {(amount / 100).toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={onNewPayment}
          variant="outline"
          className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
        >
          ↻ Novo Pagamento
        </Button>
      </Card>
    </div>
  )
}
