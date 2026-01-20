"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * 🍪 BANNER DE CONSENTIMENTO LGPD
 * 
 * Exibe banner de cookies conforme LGPD e GDPR
 * - Salva consentimento no localStorage
 * - Links para Política de Privacidade e Termos de Uso
 * - Design profissional e não intrusivo
 * - Bloqueia tracking até aceitação
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se usuário já deu consentimento
    const consent = localStorage.getItem('cookie_consent')
    
    if (!consent) {
      // Delay de 1 segundo para não ser intrusivo
      setTimeout(() => {
        setShowBanner(true)
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleAccept = () => {
    // Salvar consentimento
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    
    setShowBanner(false)

    // Disparar evento customizado para iniciar tracking
    window.dispatchEvent(new Event('cookieConsentGiven'))
    
    console.log('✅ Consentimento de cookies aceito')
  }

  const handleReject = () => {
    // Salvar rejeição (apenas cookies essenciais)
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    
    setShowBanner(false)
    
    console.log('❌ Consentimento de cookies rejeitado - apenas essenciais')
  }

  // Não renderizar nada enquanto carrega ou se já foi aceito
  if (isLoading || !showBanner) {
    return null
  }

  return (
    <>
      {/* Overlay semi-transparente */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in" />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          
          {/* Barra de destaque superior */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              
              {/* Ícone de Cookie */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  🍪 Cookies e Privacidade
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, 
                  personalizar conteúdo, analisar tráfego e exibir anúncios relevantes. 
                  Seus dados são tratados conforme a <strong className="text-white">LGPD</strong> e <strong className="text-white">GDPR</strong>.
                </p>
                
                {/* Links para políticas */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link 
                    href="/politica-privacidade" 
                    className="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-4 transition-colors"
                  >
                    📄 Política de Privacidade
                  </Link>
                  <Link 
                    href="/termos-de-uso" 
                    className="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-4 transition-colors"
                  >
                    📋 Termos de Uso
                  </Link>
                </div>

                {/* Tipos de cookies */}
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-300 transition-colors">
                    🔍 Ver detalhes dos cookies utilizados
                  </summary>
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700">
                    <p><strong className="text-slate-300">Essenciais:</strong> Necessários para o funcionamento do site</p>
                    <p><strong className="text-slate-300">Analytics:</strong> Google Analytics, métricas de performance</p>
                    <p><strong className="text-slate-300">Marketing:</strong> Meta Pixel, Google Ads, remarketing</p>
                    <p><strong className="text-slate-300">Funcionais:</strong> Preferências e personalização</p>
                  </div>
                </details>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 md:flex-shrink-0">
                <button
                  onClick={handleAccept}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ✓ Aceitar Todos
                </button>
                
                <button
                  onClick={handleReject}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-200"
                >
                  Apenas Essenciais
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Estilos para animações */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(100%); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  )
}
