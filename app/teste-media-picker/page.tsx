'use client'

import MediaPicker from '@/components/whatsapp/MediaPicker'
import { useState } from 'react'

export default function TestePage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🧪 Teste do MediaPicker</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-4">MediaPicker Component:</h2>
          <div className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
            <MediaPicker
              onEmojiSelect={(emoji) => {
                console.log('Emoji selecionado:', emoji)
                setSelectedItems(prev => [...prev, `Emoji: ${emoji}`])
              }}
              onStickerSelect={(url) => {
                console.log('Sticker selecionado:', url)
                setSelectedItems(prev => [...prev, `Sticker: ${url}`])
              }}
              onGifSelect={(url) => {
                console.log('GIF selecionado:', url)
                setSelectedItems(prev => [...prev, `GIF: ${url}`])
              }}
            />
            <input
              type="text"
              placeholder="Campo de texto de teste..."
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">Itens Selecionados:</h2>
          {selectedItems.length === 0 ? (
            <p className="text-gray-400">Nenhum item selecionado ainda</p>
          ) : (
            <ul className="space-y-2">
              {selectedItems.map((item, index) => (
                <li key={index} className="text-green-400 text-sm font-mono">
                  {index + 1}. {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
