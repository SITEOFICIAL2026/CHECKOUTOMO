"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { isValidCPF } from "@/lib/cpf-validator"

interface PaymentFormProps {
  onSubmit: (data: {
    name: string
    email: string
    phone: string
    cpf: string
    description: string
  }) => void
  loading: boolean
  error: string | null
  amount: number
  onAmountChange: (amount: number) => void
}

export function PaymentForm({ onSubmit, loading, error, amount, onAmountChange }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    description: "Pagamento Transparente PIX",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData((prev) => ({ ...prev, cpf: formatted }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "")
    let formatted = numbers
    if (numbers.length > 0) {
      if (numbers.length <= 2) {
        formatted = `(${numbers}`
      } else if (numbers.length <= 7) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
      } else {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
      }
    }
    setFormData((prev) => ({ ...prev, phone: formatted }))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const numValue = Number.parseInt(value) || 0
    onAmountChange(numValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidCPF(formData.cpf)) {
      return
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.cpf) {
      return
    }
    onSubmit(formData)
  }

  const isFormValid = formData.name && formData.email && formData.phone && isValidCPF(formData.cpf)

  return (
    <Card className="p-8 border-0 shadow-sm bg-white dark:bg-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Pagamento PIX</h1>
        <p className="text-slate-600 dark:text-slate-400">Preencha os dados abaixo para gerar seu QR Code</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Valor (em centavos)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-900 dark:text-white">R$</span>
            <Input
              type="text"
              value={(amount / 100).toFixed(2)}
              onChange={handleAmountChange}
              placeholder="100,00"
              className="text-lg font-semibold"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total: R$ {(amount / 100).toFixed(2)}</p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nome completo
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="João Silva"
            disabled={loading}
            required
            className="dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@email.com"
            disabled={loading}
            required
            className="dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Telefone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            disabled={loading}
            required
            className="dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            CPF
          </label>
          <Input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleCPFChange}
            placeholder="000.000.000-00"
            disabled={loading}
            required
            maxLength={14}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {formData.cpf && !isValidCPF(formData.cpf) && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">CPF inválido</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
        </Button>
      </form>
    </Card>
  )
}
