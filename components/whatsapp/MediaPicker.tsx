// ================================================================
// MediaPicker - Seletor Customizado de Emoji, Sticker e GIF
// ================================================================
// 100% customizado, sem dependências externas
// ================================================================

'use client'

import { useState } from 'react'
import { Smile, Sticker as StickerIcon, ImageIcon, X } from 'lucide-react'

// 60+ Emojis mais populares do WhatsApp
const POPULAR_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
  '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
  '🤢', '🤮', '🤧', '🥵', '🥶', '😎', '🤓', '🧐',
  '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳',
  '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭',
  '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱',
  '😤', '😡', '😠', '🤬', '👍', '👎', '👌', '✌️',
  '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇',
  '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
  '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗',
  '🔥', '✨', '💯', '💢', '💥', '💫', '💦', '💨',
  '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉'
]

// Stickers mockup (URLs de exemplo)
const MOCK_STICKERS = [
  'https://placehold.co/120x120/667eea/fff?text=Sticker+1',
  'https://placehold.co/120x120/f093fb/fff?text=Sticker+2',
  'https://placehold.co/120x120/4facfe/fff?text=Sticker+3',
  'https://placehold.co/120x120/00f2fe/fff?text=Sticker+4',
  'https://placehold.co/120x120/43e97b/fff?text=Sticker+5',
  'https://placehold.co/120x120/38f9d7/fff?text=Sticker+6',
  'https://placehold.co/120x120/fa709a/fff?text=Sticker+7',
  'https://placehold.co/120x120/fee140/fff?text=Sticker+8',
  'https://placehold.co/120x120/30cfd0/fff?text=Sticker+9',
  'https://placehold.co/120x120/a8edea/fff?text=Sticker+10',
  'https://placehold.co/120x120/ff6b6b/fff?text=Sticker+11',
  'https://placehold.co/120x120/feca57/fff?text=Sticker+12'
]

// GIFs mockup (URLs de exemplo)
const MOCK_GIFS = [
  'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
  'https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif',
  'https://media.giphy.com/media/26tP4gFBQewkLnMv6/giphy.gif',
  'https://media.giphy.com/media/3o7abB06u9bNzA8lu8/giphy.gif'
]

type TabType = 'emoji' | 'sticker' | 'gif'

interface MediaPickerProps {
  onEmojiSelect: (emoji: string) => void
  onStickerSelect: (url: string) => void
  onGifSelect: (url: string) => void
  disabled?: boolean
}

export default function MediaPicker({
  onEmojiSelect,
  onStickerSelect,
  onGifSelect,
  disabled = false
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('emoji')
  
  console.log('🎨 MediaPicker renderizado! isOpen:', isOpen, 'disabled:', disabled)

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
  }

  const handleStickerClick = (url: string) => {
    onStickerSelect(url)
    setIsOpen(false)
  }

  const handleGifClick = (url: string) => {
    onGifSelect(url)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        title="Emoji, Sticker e GIF"
        type="button"
      >
        <Smile className="w-5 h-5 text-gray-300" />
      </button>
    )
  }

  return (
    <div className="relative flex-shrink-0">
      {/* Botão Fechar */}
      <button
        onClick={() => setIsOpen(false)}
        className="p-2 rounded-full hover:bg-white/10 transition flex-shrink-0 bg-white/5"
        title="Fechar"
        type="button"
      >
        <X className="w-5 h-5 text-gray-300" />
      </button>

      {/* Popover */}
      <div className="absolute bottom-full left-0 mb-2 bg-[#1f2a30] border border-gray-600 rounded-lg shadow-2xl w-[340px] z-50">
        {/* Abas */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab('emoji')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'emoji'
                ? 'bg-[#00a884]/20 text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
            type="button"
          >
            <Smile className="w-4 h-4" />
            Emojis
          </button>
          <button
            onClick={() => setActiveTab('sticker')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'sticker'
                ? 'bg-[#00a884]/20 text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
            type="button"
          >
            <StickerIcon className="w-4 h-4" />
            Stickers
          </button>
          <button
            onClick={() => setActiveTab('gif')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'gif'
                ? 'bg-[#00a884]/20 text-[#00a884] border-b-2 border-[#00a884]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
            type="button"
          >
            <ImageIcon className="w-4 h-4" />
            GIFs
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-3 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* Aba Emojis */}
          {activeTab === 'emoji' && (
            <div className="grid grid-cols-8 gap-1">
              {POPULAR_EMOJIS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 text-2xl hover:bg-white/10 rounded transition flex items-center justify-center"
                  title={emoji}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Aba Stickers */}
          {activeTab === 'sticker' && (
            <div>
              <p className="text-xs text-gray-400 mb-3 px-1">
                Clique no sticker para enviar:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {MOCK_STICKERS.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleStickerClick(url)}
                    className="aspect-square rounded-lg hover:bg-white/10 transition p-1 border border-gray-700 hover:border-[#00a884] overflow-hidden"
                    type="button"
                  >
                    <img
                      src={url}
                      alt={`Sticker ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 px-1 text-center">
                (Stickers reais via API serão integrados em breve)
              </p>
            </div>
          )}

          {/* Aba GIFs */}
          {activeTab === 'gif' && (
            <div>
              <p className="text-xs text-gray-400 mb-3 px-1">
                Clique no GIF para enviar:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_GIFS.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleGifClick(url)}
                    className="aspect-video rounded-lg hover:bg-white/10 transition overflow-hidden border border-gray-700 hover:border-[#00a884]"
                    type="button"
                  >
                    <img
                      src={url}
                      alt={`GIF ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 px-1 text-center">
                (Integração com Giphy/Tenor API em breve)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
