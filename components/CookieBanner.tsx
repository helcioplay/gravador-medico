"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * 🍪 BANNER DE CONSENTIMENTO LGPD - Minimalista
 * 
 * - ID do site para compliance
 * - Design limpo e não obstrutivo
 * - Permite navegar sem decisão obrigatória
 * - Sem overlay/blur no fundo
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verificar se usuário já interagiu com o banner
    const consent = localStorage.getItem('cookie_consent')
    
    if (!consent) {
      // Mostrar banner após 2 segundos
      setTimeout(() => {
        setShowBanner(true)
      }, 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowBanner(false)
    
    // Disparar evento para iniciar tracking
    window.dispatchEvent(new Event('cookieConsentGiven'))
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Barra superior azul */}
        <div className="h-1 bg-blue-600" />
        
        <div className="p-5">
          {/* Cabeçalho com ID do site */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍪</span>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Cookies
                </h3>
                <p className="text-xs text-gray-500">
                  ID: gravadormedico.com.br
                </p>
              </div>
            </div>
            
            {/* Botão fechar (permite continuar sem decidir) */}
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Texto */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Usamos cookies para melhorar sua experiência e analisar nosso tráfego. 
            Ao continuar, você aceita nosso uso de cookies.
          </p>

          {/* Links */}
          <div className="flex gap-3 text-xs mb-4">
            <Link 
              href="/politica-privacidade" 
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Política de Privacidade
            </Link>
            <Link 
              href="/termos-de-uso" 
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Termos de Uso
            </Link>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Recusar
            </button>
          </div>
        </div>
      </div>

      {/* Animação */}
      <style jsx>{`
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
