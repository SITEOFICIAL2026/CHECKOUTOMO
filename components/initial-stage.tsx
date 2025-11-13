"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { isValidCPF } from "@/lib/cpf-validator"

interface InitialStageProps {
  onGenerateQR: (cpf: string) => void
  loading: boolean
  error: string | null
}

export function InitialStage({ onGenerateQR, loading, error }: InitialStageProps) {
  const [cpf, setCpf] = useState("")

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidCPF(cpf)) {
      onGenerateQR(cpf)
    }
  }

  const isValid = isValidCPF(cpf)

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-8 border-0 shadow-md bg-white rounded-2xl">
        <div className="mb-8 text-center">
          <p className="text-gray-600 text-lg leading-relaxed">
            Clique no botão abaixo para gerar o código PIX e realizar o pagamento.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CPF Input */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              disabled={loading}
              required
              maxLength={14}
              className="text-center text-lg font-semibold border-gray-300 focus:border-[#0056B3] focus:ring-[#0056B3]"
            />
            {cpf && !isValid && <p className="text-xs text-red-600 mt-1">CPF inválido</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 text-base font-semibold bg-[#0056B3] hover:bg-[#004399] text-white rounded-lg transition-colors"
          >
            {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
