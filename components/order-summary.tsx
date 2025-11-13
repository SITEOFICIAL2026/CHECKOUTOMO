"use client"

import { Card } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

interface OrderSummaryProps {
  amount: number
}

export function OrderSummary({ amount }: OrderSummaryProps) {
  return (
    <Card className="sticky top-8 p-6 border-0 shadow-sm bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resumo do Pedido</h2>
      </div>

      <div className="space-y-4">
        {/* Product Item */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Pagamento Transparente PIX</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quantidade: 1</p>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">R$ {(amount / 100).toFixed(2)}</p>
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
            <span className="text-slate-900 dark:text-white">R$ {(amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Taxa</span>
            <span className="text-slate-900 dark:text-white">R$ 0,00</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-900 dark:text-white">Total</span>
            <span className="text-slate-900 dark:text-white">R$ {(amount / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mt-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">Pagamento via PIX - Instant payment</p>
        </div>
      </div>
    </Card>
  )
}
