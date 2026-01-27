import * as React from 'react'

interface WelcomeEmailProps {
  customerName: string
  userEmail: string
  userPassword: string
  orderId: string
  orderValue: number
  paymentMethod: string
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  customerName,
  userEmail,
  userPassword,
  orderId,
  orderValue,
  paymentMethod,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
        <tr>
          <td align="center">
            <table width="600" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              
              {/* Header */}
              <tr>
                <td style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)', padding: '40px 30px', textAlign: 'center' }}>
                  <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                    🎉 Bem-vindo ao Gravador Médico!
                  </h1>
                  <p style={{ color: '#ffffff', margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
                    Seu acesso está pronto!
                  </p>
                </td>
              </tr>

              {/* Content */}
              <tr>
                <td style={{ padding: '40px 30px' }}>
                  <p style={{ color: '#333333', fontSize: '16px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    Olá, <strong>{customerName}</strong>! 👋
                  </p>
                  
                  <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.6', margin: '0 0 30px 0' }}>
                    Sua compra foi confirmada com sucesso! Estamos muito felizes em ter você conosco. 
                    Abaixo estão suas credenciais de acesso:
                  </p>

                  {/* Credentials Box */}
                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f8fafc', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '30px' }}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <p style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 15px 0', fontWeight: 'bold' }}>
                          🔐 Suas Credenciais
                        </p>
                        
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tr>
                            <td style={{ paddingBottom: '12px' }}>
                              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>Email:</p>
                              <p style={{ color: '#111827', fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'monospace' }}>
                                {userEmail}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>Senha:</p>
                              <p style={{ color: '#111827', fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'monospace' }}>
                                {userPassword}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* CTA Button */}
                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '30px' }}>
                    <tr>
                      <td align="center">
                        <a 
                          href="https://www.gravadormedico.com.br/login" 
                          style={{ 
                            display: 'inline-block',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '16px 40px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                          }}
                        >
                          ✨ Acessar Plataforma
                        </a>
                      </td>
                    </tr>
                  </table>

                  {/* Order Details */}
                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '25px' }}>
                    <tr>
                      <td>
                        <p style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 15px 0', fontWeight: 'bold' }}>
                          📋 Detalhes do Pedido
                        </p>
                        
                        <table width="100%" cellPadding="8" cellSpacing="0">
                          <tr>
                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Número do Pedido:</td>
                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>#{orderId}</td>
                          </tr>
                          <tr>
                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Valor:</td>
                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderValue)}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Método de Pagamento:</td>
                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>{paymentMethod}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Support Info */}
                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '25px' }}>
                    <tr>
                      <td>
                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                          💬 <strong>Precisa de ajuda?</strong><br />
                          Nossa equipe está disponível para te ajudar no WhatsApp ou por email.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td style={{ backgroundColor: '#f8fafc', padding: '30px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 10px 0' }}>
                    © 2026 Gravador Médico - Todos os direitos reservados
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                    🩺 Economize 3h/dia com IA médica
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
)
