"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PixCheckout() {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const amount = 1000 // R$ 10,00

  const handleGeneratePix = async () => {
    setLoading(true)
    setPaid(false)
    setQrCode(null)
    setPixCode(null)
    setError(null)

    try {
      const randomCPF = "11144477735"

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: randomCPF,
          amount,
        }),
      })

      const data = await response.json()
      console.log("[v0] API Response:", data)

      if (!response.ok) {
        setError(data.error || "Erro ao gerar PIX")
        setLoading(false)
        return
      }

      const code = data.qrcode || data.pix?.qrcode || data.pix?.code || null

      if (code) {
        console.log("[v0] PIX Code received:", code)
        setPixCode(code)
        setTransactionId(data.id)

        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(code)}&size=300x300`
        setQrCode(qrImageUrl)

        const interval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/pix/status?transactionId=${data.id}`)
            const statusData = await statusRes.json()

            if (statusData.paid || statusData.status === "paid") {
              clearInterval(interval)
              setPaid(true)
            }
          } catch (e) {
            console.error("[v0] Error checking payment:", e)
          }
        }, 5000)

        setTimeout(() => clearInterval(interval), 600000)
      } else {
        console.log("[v0] No QR code in response:", data)
        setError("Erro ao gerar QR Code PIX. Tente novamente.")
      }
    } catch (err) {
      console.error("[v0] Error:", err)
      setError("Falha na comunicação com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary py-4 px-6 shadow-md">
        <div className="container mx-auto"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-2">Finalizar pagamento via PIX</h1>
          <p className="text-center text-muted-foreground mb-8">Rápido, seguro e sem taxas</p>

          <Card className="p-6 md:p-8 shadow-lg">
            {!qrCode && !loading && (
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Clique no botão abaixo para gerar o código PIX e realizar o pagamento.
                </p>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="mb-6 p-6 bg-slate-50 rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Valor a pagar</p>
                  <p className="text-4xl font-bold text-primary">R$ {(amount / 100).toFixed(2)}</p>
                </div>
                <Button
                  onClick={handleGeneratePix}
                  size="lg"
                  className="w-full md:w-auto px-8 py-6 text-lg font-semibold"
                >
                  Gerar QR Code PIX
                </Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
                <p className="text-muted-foreground">Gerando QR Code...</p>
              </div>
            )}

            {qrCode && !paid && (
              <div className="text-center">
                <p className="text-foreground mb-6 font-medium">Escaneie o QR Code abaixo para realizar o pagamento:</p>
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm mb-6 border border-gray-200">
                  <img
                    src={qrCode || "/placeholder.svg"}
                    alt="QR Code PIX"
                    className="w-[300px] h-[300px]"
                    onError={(e) => {
                      console.error("[v0] Failed to load QR code image")
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
                {pixCode && (
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Código PIX (Copia e Cola):</p>
                    <div className="flex gap-2 flex-col md:flex-row">
                      <code className="flex-1 text-xs break-all block bg-background p-3 rounded border text-left font-mono">
                        {pixCode}
                      </code>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="px-4 bg-transparent md:w-auto w-full"
                      >
                        {copied ? "✓ Copiado" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">Aguardando confirmação do pagamento...</p>
              </div>
            )}

            {paid && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Pagamento confirmado com sucesso!</h3>
                <p className="text-muted-foreground mb-4">Sua transação foi processada. Obrigado!</p>
                {transactionId && <p className="text-xs text-muted-foreground mb-6">ID: {transactionId}</p>}
                <Button
                  onClick={() => {
                    setQrCode(null)
                    setPixCode(null)
                    setPaid(false)
                    setTransactionId(null)
                  }}
                  className="mt-6"
                >
                  Novo Pagamento
                </Button>
              </div>
            )}
          </Card>

          {qrCode && !paid && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Valor: <span className="font-semibold">R$ {(amount / 100).toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} Governo do Estado de São Paulo - Sistema Integrado de Pagamentos Digitais
          </p>
        </div>
      </footer>
    </div>
  )
}
