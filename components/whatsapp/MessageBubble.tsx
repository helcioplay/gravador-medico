// ================================================================
// Message Bubble - Balão de mensagem (estilo WhatsApp)
// ================================================================

'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WhatsAppMessage } from '@/lib/types/whatsapp'
import { CheckCheck, Check, Clock } from 'lucide-react'

interface MessageBubbleProps {
  message: WhatsAppMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isFromMe = message.from_me

  return (
    <div
      className={`flex mb-4 ${isFromMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-md px-4 py-2 rounded-lg shadow-sm ${
          isFromMe
            ? 'bg-green-500 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none'
        }`}
      >
        {/* Mídia (se houver) */}
        {message.media_url && (
          <MessageMedia
            type={message.message_type}
            url={message.media_url}
            caption={message.caption}
          />
        )}

        {/* Conteúdo de texto */}
        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Timestamp + Status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={`text-xs ${
              isFromMe ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {format(new Date(message.timestamp), 'HH:mm', { locale: ptBR })}
          </span>

          {isFromMe && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  )
}

/**
 * Renderiza mídia (imagem, vídeo, etc)
 */
function MessageMedia({
  type,
  url,
  caption
}: {
  type: WhatsAppMessage['message_type']
  url: string
  caption?: string
}) {
  if (type === 'image') {
    return (
      <div className="mb-2">
        <img
          src={url}
          alt={caption || 'Imagem'}
          className="rounded-lg max-w-full h-auto"
        />
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className="mb-2">
        <video controls className="rounded-lg max-w-full">
          <source src={url} />
        </video>
      </div>
    )
  }

  if (type === 'audio') {
    return (
      <div className="mb-2">
        <audio controls className="w-full">
          <source src={url} />
        </audio>
      </div>
    )
  }

  if (type === 'document') {
    return (
      <div className="mb-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm underline"
        >
          📄 {caption || 'Documento'}
        </a>
      </div>
    )
  }

  if (type === 'sticker') {
    return (
      <div className="mb-2">
        <img
          src={url}
          alt="Sticker"
          className="w-32 h-32 object-contain"
        />
      </div>
    )
  }

  return null
}

/**
 * Ícone de status da mensagem (enviada, entregue, lida)
 */
function MessageStatus({ status }: { status?: WhatsAppMessage['status'] }) {
  if (status === 'read') {
    return <CheckCheck className="w-4 h-4 text-blue-300" />
  }

  if (status === 'delivered') {
    return <CheckCheck className="w-4 h-4 text-green-100" />
  }

  if (status === 'sent') {
    return <Check className="w-4 h-4 text-green-100" />
  }

  // Pendente
  return <Clock className="w-4 h-4 text-green-100" />
}
