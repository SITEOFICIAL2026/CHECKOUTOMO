"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Copy, RotateCcw } from "lucide-react"

interface QrCodeDisplayProps {
  qrCode: string
  transactionId: string | null
  amount: number
  onNewPayment: () => void
}

export function QrCodeDisplay({ qrCode, transactionId, amount, onNewPayment }: QrCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

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

  return (
    <div className="space-y-6">
      <Card className="p-8 border-0 shadow-sm bg-white dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">QR Code PIX</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Escaneie com seu banco ou copie o código abaixo</p>

        {/* QR Code Container */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 flex justify-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <img src={qrCode || "/placeholder.svg"} alt="PIX QR Code" className="w-64 h-64 object-contain" />
          </div>
        </div>

        {/* Copy Code Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Código PIX (copiar e colar)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrCode}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 font-mono"
              />
              <Button onClick={copyToClipboard} variant="outline" className="px-4 bg-transparent">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Info Card */}
      <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Valor</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">R$ {(amount / 100).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">ID da Transação</span>
            <span className="text-sm font-mono text-slate-900 dark:text-white truncate">{transactionId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Expira em</span>
            <span
              className={`text-lg font-semibold ${
                timeLeft < 60 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
              }`}
            >
              {minutes}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={onNewPayment} variant="outline" className="flex-1 bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      {/* Status Message */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Assim que o pagamento for confirmado, você receberá uma notificação. Deixe esta página aberta.
        </p>
      </div>
    </div>
  )
}
