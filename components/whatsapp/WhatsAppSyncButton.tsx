// ================================================================
// Botão de Sincronização Manual (para adicionar no dashboard)
// ================================================================

'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface SyncButtonProps {
  onSyncComplete?: () => void
}

export default function WhatsAppSyncButton({ onSyncComplete }: SyncButtonProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleSync() {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/whatsapp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync-all',
          messagesLimit: 100
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(`✅ ${data.totalChats} chats e ${data.totalMessages} mensagens sincronizadas!`)
        onSyncComplete?.()
      } else {
        setResult(`❌ Erro: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Erro ao sincronizar: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Sincronizando...' : 'Sincronizar Histórico'}
      </button>

      {result && (
        <p className="mt-2 text-sm text-gray-600">
          {result}
        </p>
      )}
    </div>
  )
}
