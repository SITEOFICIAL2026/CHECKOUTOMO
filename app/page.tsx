"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, MapPin, Home, Building2, ArrowRight, Package, CheckCircle2, Clock, Truck } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [state, setState] = useState("initial")
  const [qrCode, setQrCode] = useState("")
  const [pixCode, setPixCode] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [timeLeft, setTimeLeft] = useState(600)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cep: "",
    houseNumber: "",
    complement: "",
  })

  useEffect(() => {
    if (state !== "qr_code") return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateQRCode()
          return 600
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "cep") {
      setFormData((prev) => ({ ...prev, [name]: formatCEP(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.cep.length === 9 &&
      formData.houseNumber.trim() !== ""
    )
  }

  const proceedToPayment = () => {
    if (!isFormValid()) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }
    setState("confirm_data")
  }

  const generateQRCode = async () => {
    setState("loading")
    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 19.9 }),
      })

      if (!response.ok) throw new Error("Falha ao gerar QR Code")

      const data = await response.json()
      setPixCode(data.qr_code)
      setTransactionId(data.id)
      setState("qr_code")
      setTimeLeft(600)
    } catch (error) {
      console.error("[v0] Error:", error)
      setState("error")
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Copy error:", error)
    }
  }

  const goToSuccess = () => {
    router.push("/sucesso")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-white via-blue-50 to-white py-6 px-4 shadow-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <img
            src="https://www.omo.com/images/h0nadbhvm6m4/68zXpMN3Shc1IgECsZjlFg/9505212f848a00b77ba23ca9cadea243/T01PX0xPR09fTE9DS1VQX0hPUklaX0JMVUUyOTRfUkdCX18xXy5wbmc/320w-184h/omo-logo.avif"
            alt="OMO Logo"
            className="h-14 w-auto drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      </header>

      <div className="flex-1 py-10 md:py-16 px-4">
        <div className="w-full max-w-3xl mx-auto">
          {state === "initial" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#103e84] to-[#1a5bb8] rounded-full mb-4 shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#103e84] mb-2">Dados para Entrega</h2>
                <p className="text-gray-600">Preencha seus dados para receber seu produto OMO</p>
              </div>

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-bold text-[#103e84] mb-2 uppercase tracking-wide"
                  >
                    Nome Completo *
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#103e84] transition-colors group-focus-within:text-[#ffe600]" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Digite seu nome completo"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#ffe600]/50 focus:border-[#103e84] transition-all shadow-sm hover:shadow-md bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-[#103e84] mb-2 uppercase tracking-wide"
                  >
                    E-mail *
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#103e84] transition-colors group-focus-within:text-[#ffe600]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#ffe600]/50 focus:border-[#103e84] transition-all shadow-sm hover:shadow-md bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-bold text-[#103e84] mb-2 uppercase tracking-wide">
                    CEP *
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#103e84] transition-colors group-focus-within:text-[#ffe600]" />
                    <input
                      id="cep"
                      name="cep"
                      type="text"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      required
                      maxLength={9}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#ffe600]/50 focus:border-[#103e84] transition-all shadow-sm hover:shadow-md bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="houseNumber"
                      className="block text-sm font-bold text-[#103e84] mb-2 uppercase tracking-wide"
                    >
                      Número *
                    </label>
                    <div className="relative group">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#103e84] transition-colors group-focus-within:text-[#ffe600]" />
                      <input
                        id="houseNumber"
                        name="houseNumber"
                        type="number"
                        value={formData.houseNumber}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#ffe600]/50 focus:border-[#103e84] transition-all shadow-sm hover:shadow-md bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="complement"
                      className="block text-sm font-bold text-[#103e84] mb-2 uppercase tracking-wide"
                    >
                      Complemento
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#103e84] transition-colors group-focus-within:text-[#ffe600]" />
                      <input
                        id="complement"
                        name="complement"
                        type="text"
                        value={formData.complement}
                        onChange={handleInputChange}
                        placeholder="Apto 101 (opcional)"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#ffe600]/50 focus:border-[#103e84] transition-all shadow-sm hover:shadow-md bg-white"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <button
                onClick={proceedToPayment}
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-r from-[#103e84] to-[#1a5bb8] hover:from-[#0d3268] hover:to-[#103e84] disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-2xl text-lg transition-all shadow-lg hover:shadow-2xl disabled:cursor-not-allowed mt-10 flex items-center justify-center gap-3 group"
              >
                Próximo
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {state === "confirm_data" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#103e84] mb-2">Confirme seus Dados</h2>
                <p className="text-gray-600">Verifique se todas as informações estão corretas</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 mb-8 border-2 border-[#103e84]/20 shadow-inner">
                <h3 className="text-xl font-bold text-[#103e84] mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Dados de Entrega
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                    <User className="w-5 h-5 text-[#103e84] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nome</span>
                      <span className="text-base font-semibold text-gray-900">{formData.fullName}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                    <Mail className="w-5 h-5 text-[#103e84] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">E-mail</span>
                      <span className="text-base font-semibold text-gray-900">{formData.email}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                    <MapPin className="w-5 h-5 text-[#103e84] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Endereço</span>
                      <span className="text-base font-semibold text-gray-900">
                        CEP {formData.cep}, Nº {formData.houseNumber}
                        {formData.complement && `, ${formData.complement}`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setState("initial")}
                  className="mt-6 text-[#103e84] font-bold hover:text-[#0d3268] transition-colors flex items-center gap-2 hover:gap-3 transition-all"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Editar dados
                </button>
              </div>

              <button
                onClick={() => setState("shipping_info")}
                className="w-full bg-gradient-to-r from-[#103e84] to-[#1a5bb8] hover:from-[#0d3268] hover:to-[#103e84] text-white font-bold py-5 px-6 rounded-2xl text-lg transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group"
              >
                Próximo
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {state === "shipping_info" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#ffe600] to-[#ffd700] rounded-full mb-6 shadow-xl">
                  <Truck className="w-10 h-10 text-[#103e84]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#103e84] mb-3">Informações de Entrega</h2>
                <p className="text-gray-600 text-lg">Seu pedido será enviado para o endereço cadastrado</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-8 mb-8 border-2 border-[#103e84]/20">
                <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#103e84] flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Produto</p>
                      <p className="text-lg font-bold text-[#103e84]">produtos OMO</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#103e84]" />
                      <span className="font-semibold text-gray-700">Frete</span>
                    </div>
                    <span className="text-xl font-bold text-[#103e84]">R$ 19,90</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-2">Entrega Garantida</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Prazo de entrega: 5 a 10 dias úteis</li>
                      <li>• Rastreamento disponível após o pagamento</li>
                      <li>• Embalagem segura e protegida</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={generateQRCode}
                className="w-full bg-gradient-to-r from-[#103e84] to-[#1a5bb8] hover:from-[#0d3268] hover:to-[#103e84] text-white font-bold py-5 px-6 rounded-2xl text-lg transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group"
              >
                Próximo
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {state === "loading" && (
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#103e84] border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="text-xl text-[#103e84] font-bold">Gerando QR Code PIX...</p>
                <p className="text-sm text-gray-600">Aguarde um momento</p>
              </div>
            </div>
          )}

          {state === "qr_code" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#103e84] mb-3">Finalize seu Pagamento</h2>
                <p className="text-gray-600 text-lg">Escaneie o QR Code ou copie o código PIX</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-xl border-2 border-[#103e84]/20 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`}
                    alt="QR Code PIX"
                    className="w-56 h-56 md:w-64 md:h-64 relative z-10"
                  />
                </div>
              </div>

              <div
                className={`text-center p-4 rounded-xl font-semibold text-base mb-6 flex items-center justify-center gap-2 ${
                  timeLeft > 60 ? "bg-[#103e84]/10 text-[#103e84]" : "bg-red-100 text-red-700 animate-pulse"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Válido por: {formatTime(timeLeft)}</span>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-[#103e84]/20">
                <h3 className="text-sm font-bold text-[#103e84] mb-3 uppercase tracking-wide text-center">
                  Código PIX Copia e Cola
                </h3>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-xl font-mono text-xs bg-white shadow-sm"
                  />
                  <button
                    onClick={copyCode}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-gradient-to-r from-[#ffe600] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffe600] text-[#103e84]"
                    }`}
                  >
                    {copied ? "✓ Copiado!" : "Copiar Código"}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#103e84] rounded-xl p-5 mb-6">
                <h4 className="font-bold text-[#103e84] mb-2 text-sm">Como pagar:</h4>
                <ol className="text-sm text-gray-700 space-y-1.5 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha pagar com PIX QR Code ou Copia e Cola</li>
                  <li>Escaneie o código ou cole o código PIX</li>
                  <li>Confirme o pagamento de R$ 19,90</li>
                </ol>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium">Aguardando confirmação do pagamento...</p>
              </div>

              <button
                onClick={goToSuccess}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Já realizei o pagamento
              </button>
            </div>
          )}

          {state === "error" && (
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-red-200">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-red-600 font-bold text-xl">Erro ao gerar QR Code</p>
                <p className="text-gray-600">Por favor, tente novamente</p>
                <button
                  onClick={generateQRCode}
                  className="w-full bg-gradient-to-r from-[#103e84] to-[#1a5bb8] hover:from-[#0d3268] hover:to-[#103e84] text-white font-bold py-5 px-6 rounded-2xl text-lg transition-all shadow-lg hover:shadow-2xl"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-8 px-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
          © 2025 OMO. Todos os direitos reservados. Pagamento seguro e criptografado.
        </p>
      </footer>
    </div>
  )
}
