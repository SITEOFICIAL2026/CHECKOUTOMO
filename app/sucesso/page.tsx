"use client"

import { useRouter } from "next/navigation"

export default function SucessoPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-6 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Pagamento Realizado</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">Pagamento Realizado com Sucesso!</h2>

          {/* Message - only showing success confirmation */}
          <p className="text-gray-600 text-lg">Sua transação foi processada com sucesso.</p>

          {/* Value */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Valor pago:</p>
            <p className="text-2xl font-bold text-blue-600">R$ 19,90</p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Voltar ao Início
          </button>
        </div>
      </div>

      <div className="bg-gray-100 py-3 px-4 text-center text-xxs text-gray-600">
        <p className="leading-tight">
          © 2025 Governo do Estado de São Paulo – Prefeitura Municipal. Todos os direitos reservados. Portal oficial
          para emissão e regularização de licenças municipais. Ambiente seguro e criptografado – GOV.SP
        </p>
      </div>
    </div>
  )
}
