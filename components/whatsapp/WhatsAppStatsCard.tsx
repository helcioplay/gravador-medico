// ================================================================
// WhatsApp Stats Card - Painel de Estatísticas
// ================================================================
// Componente para exibir métricas do inbox no dashboard principal
// ================================================================

'use client'

import { useEffect, useState } from 'react'
import { getWhatsAppStats } from '@/lib/whatsapp-db'
import { MessageSquare, Users, Bell } from 'lucide-react'

interface Stats {
  totalContacts: number
  totalMessages: number
  totalUnread: number
}

export default function WhatsAppStatsCard() {
  const [stats, setStats] = useState<Stats>({ 
    totalContacts: 0, 
    totalMessages: 0, 
    totalUnread: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadStats() {
    try {
      const data = await getWhatsAppStats()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">WhatsApp Inbox</h3>
        <MessageSquare className="w-6 h-6 opacity-80" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Conversas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase opacity-80">Conversas</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalContacts}</p>
        </div>

        {/* Mensagens */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs uppercase opacity-80">Mensagens</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalMessages}</p>
        </div>

        {/* Não lidas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4" />
            <span className="text-xs uppercase opacity-80">Não lidas</span>
          </div>
          <p className="text-2xl font-bold">
            {stats.totalUnread > 0 ? (
              <span className="text-yellow-300">{stats.totalUnread}</span>
            ) : (
              stats.totalUnread
            )}
          </p>
        </div>
      </div>

      <a
        href="/dashboard/whatsapp"
        className="mt-4 block w-full text-center bg-white/20 hover:bg-white/30 transition py-2 rounded-lg text-sm font-medium"
      >
        Abrir Inbox →
      </a>
    </div>
  )
}
