'use client'

import { useEffect, useState } from 'react'
import { Shield, Clock, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FraudAnalysisSale {
  id: string
  appmax_order_id: string
  customer_name: string
  customer_email: string
  total_amount: number
  created_at: string
  hours_in_analysis?: number
}

export function FraudAnalysisCard() {
  const [loading, setLoading] = useState(true)
  const [sales, setSales] = useState<FraudAnalysisSale[]>([])

  useEffect(() => {
    loadFraudAnalysisSales()
    
    // Atualização automática a cada 30 segundos
    const interval = setInterval(() => {
      loadFraudAnalysisSales()
    }, 30000)

    // Supabase Realtime (se disponível)
    const channel = supabase
      .channel('fraud-analysis-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sales',
        filter: 'status=eq.fraud_analysis'
      }, () => {
        loadFraudAnalysisSales()
      })
      .subscribe()

    return () => {
      clearInterval(interval)
      channel.unsubscribe()
    }
  }, [])

  const loadFraudAnalysisSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('status', 'fraud_analysis')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Calcular tempo em análise
      const salesWithTime = (data || []).map((sale: any) => ({
        ...sale,
        hours_in_analysis: Math.floor(
          (Date.now() - new Date(sale.created_at).getTime()) / (1000 * 60 * 60)
        )
      }))

      setSales(salesWithTime)
    } catch (error) {
      console.error('Erro ao carregar vendas em análise:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)
  const hasUrgent = sales.some(s => (s.hours_in_analysis || 0) > 12)

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border ${
      hasUrgent ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-gray-700/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            hasUrgent ? 'bg-yellow-500/20' : 'bg-blue-500/20'
          }`}>
            <Shield className={`w-6 h-6 ${hasUrgent ? 'text-yellow-400' : 'text-blue-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Análise Antifraude</h3>
            <p className="text-sm text-gray-400">Pedidos em verificação</p>
          </div>
        </div>
        {hasUrgent && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">Atenção</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-3xl font-black text-white mb-1">
            {sales.length}
          </div>
          <div className="text-sm text-gray-400">Pedidos</div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-3xl font-black text-white mb-1">
            R$ {totalValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Valor Total</div>
        </div>
      </div>

      {sales.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Últimas {sales.length} em análise
          </div>
          {sales.slice(0, 5).map((sale) => {
            const isUrgent = (sale.hours_in_analysis || 0) > 12
            const isCritical = (sale.hours_in_analysis || 0) > 24
            
            return (
              <div 
                key={sale.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCritical 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : isUrgent 
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-gray-700/30 border-gray-600/30'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white truncate">
                      {sale.customer_name}
                    </span>
                    <span className="text-xs text-gray-500">#{sale.appmax_order_id.slice(-6)}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {sale.customer_email}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      R$ {(sale.total_amount || 0).toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${
                      isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{sale.hours_in_analysis}h</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nenhum pedido em análise no momento</p>
          <p className="text-xs text-gray-500 mt-1">Todos os pagamentos foram processados</p>
        </div>
      )}
    </div>
  )
}
