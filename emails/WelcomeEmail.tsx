import * as React from 'react'import * as React from 'react'import * as React from 'react'



interface WelcomeEmailProps {

  customerName: string

  userEmail: stringinterface WelcomeEmailProps {interface WelcomeEmailProps {

  userPassword: string

  orderId: string  customerName: string  customerName: string

  orderValue: number

  paymentMethod: string  userEmail: string  userEmail: string

}

  userPassword: string  userPassword: string

// Cores do Design System Gravador Médico

const colors = {  orderId: string  orderId: string

  primary: '#16A085',      // Teal - cor principal

  primaryDark: '#138D75',  // Teal escuro para hover  orderValue: number  orderValue: number

  accent: '#2EAE9A',       // Accent

  background: '#F7F9FA',   // Background claro  paymentMethod: string  paymentMethod: string

  card: '#FFFFFF',         // Card/Surface

  textPrimary: '#1A2E38',  // Texto principal}}

  textSecondary: '#5C7080', // Texto secundário

  border: '#D8DEE4',       // Bordas

  success: '#16A34A',      // Success

  muted: '#E8F8F5',        // Muted background teal// Cores do Design System Gravador Médicoexport const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({

}

const colors = {  customerName,

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({

  customerName,  primary: '#16A085',      // Teal - cor principal  userEmail,

  userEmail,

  userPassword,  primaryDark: '#138D75',  // Teal escuro  userPassword,

  orderId,

  orderValue,  accent: '#2EAE9A',       // Accent  orderId,

  paymentMethod,

}) => {  background: '#F7F9FA',   // Background claro  orderValue,

  // Formatar número do pedido

  const formatOrderId = (id: string): string => {  card: '#FFFFFF',         // Card/Surface  paymentMethod,

    if (id.includes('-')) {

      return `#${id.split('-')[0].toUpperCase()}`  textPrimary: '#1A2E38',  // Texto principal}) => (

    }

    return `#${id.substring(0, 8).toUpperCase()}`  textSecondary: '#5C7080', // Texto secundário  <html>

  }

  border: '#D8DEE4',       // Bordas    <head>

  // Formatar método de pagamento

  const formatPaymentMethod = (method: string): string => {  success: '#16A34A',      // Success      <meta charSet="utf-8" />

    const methods: Record<string, string> = {

      'pix': 'PIX',  muted: '#E8F8F5',        // Muted background    </head>

      'credit_card': 'Cartão de Crédito',

      'debit_card': 'Cartão de Débito',}    <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>

      'boleto': 'Boleto Bancário',

      'appmax': 'Cartão de Crédito',      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f5f5', padding: '40px 20px' }}>

      'mercadopago': 'Mercado Pago',

    }export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({        <tr>

    return methods[method.toLowerCase()] || method

  }  customerName,          <td align="center">



  return (  userEmail,            <table width="600" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>

    <html>

      <head>  userPassword,              

        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  orderId,              {/* Header */}

        <title>Bem-vindo ao Gravador Médico</title>

      </head>  orderValue,              <tr>

      <body style={{

        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",  paymentMethod,                <td style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)', padding: '40px 30px', textAlign: 'center' }}>

        backgroundColor: colors.background,

        margin: 0,}) => {                  <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>

        padding: 0,

      }}>  // Formatar número do pedido para exibição amigável                    🎉 Bem-vindo ao Gravador Médico!

        <table

          width="100%"  const formatOrderId = (id: string): string => {                  </h1>

          cellPadding="0"

          cellSpacing="0"    // Se for UUID, pegar os primeiros 8 caracteres                  <p style={{ color: '#ffffff', margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>

          style={{

            backgroundColor: colors.background,    if (id.includes('-')) {                    Seu acesso está pronto!

            padding: '40px 20px',

          }}      return id.split('-')[0].toUpperCase()                  </p>

        >

          <tr>    }                </td>

            <td align="center">

              <table    // Se começar com "manual-", formatar              </tr>

                width="600"

                cellPadding="0"    if (id.startsWith('manual-')) {

                cellSpacing="0"

                style={{      return id.replace('manual-', '').replace(/-/g, ' ').toUpperCase()              {/* Content */}

                  backgroundColor: colors.card,

                  borderRadius: '16px',    }              <tr>

                  overflow: 'hidden',

                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',    return id.substring(0, 8).toUpperCase()                <td style={{ padding: '40px 30px' }}>

                }}

              >  }                  <p style={{ color: '#333333', fontSize: '16px', lineHeight: '1.6', margin: '0 0 20px 0' }}>

                {/* Header com gradiente teal */}

                <tr>                    Olá, <strong>{customerName}</strong>! 👋

                  <td

                    style={{  // Formatar método de pagamento                  </p>

                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,

                      padding: '50px 40px',  const formatPaymentMethod = (method: string): string => {                  

                      textAlign: 'center',

                    }}    const methods: Record<string, string> = {                  <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.6', margin: '0 0 30px 0' }}>

                  >

                    <div style={{ marginBottom: '20px' }}>      'pix': 'PIX',                    Sua compra foi confirmada com sucesso! Estamos muito felizes em ter você conosco. 

                      <span style={{ fontSize: '40px', display: 'inline-block' }}>🎙️</span>

                    </div>      'credit_card': 'Cartão de Crédito',                    Abaixo estão suas credenciais de acesso:

                    <h1 style={{

                      color: '#FFFFFF',      'debit_card': 'Cartão de Débito',                  </p>

                      margin: 0,

                      fontSize: '28px',      'boleto': 'Boleto Bancário',

                      fontWeight: '700',

                      letterSpacing: '-0.5px',      'appmax': 'Cartão de Crédito',                  {/* Credentials Box */}

                    }}>

                      Bem-vindo ao Gravador Médico!      'mercadopago': 'Mercado Pago',                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f8fafc', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '30px' }}>

                    </h1>

                    <p style={{    }                    <tr>

                      color: 'rgba(255,255,255,0.9)',

                      margin: '12px 0 0 0',    return methods[method.toLowerCase()] || method                      <td style={{ padding: '25px' }}>

                      fontSize: '16px',

                    }}>  }                        <p style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 15px 0', fontWeight: 'bold' }}>

                      Sua compra foi aprovada com sucesso

                    </p>                          🔐 Suas Credenciais

                  </td>

                </tr>  return (                        </p>



                {/* Conteúdo Principal */}    <html>                        

                <tr>

                  <td style={{ padding: '40px' }}>      <head>                        <table width="100%" cellPadding="0" cellSpacing="0">

                    <p style={{

                      color: colors.textPrimary,        <meta charSet="utf-8" />                          <tr>

                      fontSize: '17px',

                      lineHeight: '1.6',        <meta name="viewport" content="width=device-width, initial-scale=1.0" />                            <td style={{ paddingBottom: '12px' }}>

                      margin: '0 0 24px 0',

                    }}>        <title>Bem-vindo ao Gravador Médico</title>                              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>Email:</p>

                      Olá <strong>{customerName}</strong>,

                    </p>      </head>                              <p style={{ color: '#111827', fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'monospace' }}>



                    <p style={{      <body style={{                                 {userEmail}

                      color: colors.textSecondary,

                      fontSize: '15px',        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",                               </p>

                      lineHeight: '1.7',

                      margin: '0 0 32px 0',        backgroundColor: colors.background,                             </td>

                    }}>

                      Parabéns pela sua compra! Seu acesso ao <strong style={{ color: colors.primary }}>Gravador Médico</strong> está pronto.         margin: 0,                           </tr>

                      Use as credenciais abaixo para acessar o sistema.

                    </p>        padding: 0,                          <tr>



                    {/* Box de Credenciais */}        WebkitTextSizeAdjust: '100%',                            <td style={{ paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>

                    <table

                      width="100%"        msTextSizeAdjust: '100%'                              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0' }}>Senha:</p>

                      cellPadding="0"

                      cellSpacing="0"      }}>                              <p style={{ color: '#111827', fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'monospace' }}>

                      style={{

                        backgroundColor: colors.muted,        <table                                 {userPassword}

                        borderRadius: '12px',

                        border: `1px solid ${colors.border}`,          role="presentation"                              </p>

                        marginBottom: '32px',

                      }}          width="100%"                             </td>

                    >

                      <tr>          cellPadding="0"                           </tr>

                        <td style={{ padding: '28px' }}>

                          <p style={{          cellSpacing="0"                         </table>

                            color: colors.primary,

                            fontSize: '14px',          style={{ backgroundColor: colors.background, padding: '40px 20px' }}                      </td>

                            fontWeight: '700',

                            textTransform: 'uppercase',        >                    </tr>

                            letterSpacing: '0.5px',

                            margin: '0 0 20px 0',          <tr>                  </table>

                          }}>

                            🔐 Seus Dados de Acesso            <td align="center">

                          </p>

              <table                   {/* CTA Button */}

                          <div style={{ marginBottom: '16px' }}>

                            <p style={{                role="presentation"                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '30px' }}>

                              color: colors.textSecondary,

                              fontSize: '13px',                width="600"                     <tr>

                              margin: '0 0 6px 0',

                            }}>                cellPadding="0"                       <td align="center">

                              E-mail:

                            </p>                cellSpacing="0"                         <a 

                            <p style={{

                              backgroundColor: colors.card,                style={{                           href="https://www.gravadormedico.com.br/login" 

                              color: colors.textPrimary,

                              fontSize: '15px',                  backgroundColor: colors.card,                           style={{ 

                              fontFamily: 'monospace',

                              fontWeight: '600',                  borderRadius: '12px',                             display: 'inline-block',

                              margin: 0,

                              padding: '12px 16px',                  overflow: 'hidden',                             backgroundColor: '#dc2626',

                              borderRadius: '8px',

                              border: `1px solid ${colors.border}`,                  boxShadow: '0 4px 20px -4px rgba(22, 160, 133, 0.15)'                             color: '#ffffff',

                            }}>

                              {userEmail}                }}                            textDecoration: 'none',

                            </p>

                          </div>              >                            padding: '16px 40px',



                          <div>                                            borderRadius: '8px',

                            <p style={{

                              color: colors.textSecondary,                {/* Header com Logo */}                            fontSize: '16px',

                              fontSize: '13px',

                              margin: '0 0 6px 0',                <tr>                            fontWeight: 'bold',

                            }}>

                              Senha Temporária:                  <td style={{                             boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'

                            </p>

                            <p style={{                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,                           }}

                              backgroundColor: colors.card,

                              color: colors.textPrimary,                    padding: '40px 30px',                         >

                              fontSize: '15px',

                              fontFamily: 'monospace',                    textAlign: 'center'                           ✨ Acessar Plataforma

                              fontWeight: '600',

                              margin: 0,                  }}>                        </a>

                              padding: '12px 16px',

                              borderRadius: '8px',                    {/* Logo Text */}                      </td>

                              border: `1px solid ${colors.border}`,

                            }}>                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">                    </tr>

                              {userPassword}

                            </p>                      <tr>                  </table>

                          </div>

                        </td>                        <td align="center" style={{ paddingBottom: '15px' }}>

                      </tr>

                    </table>                          <span style={{                   {/* Order Details */}



                    {/* Botão CTA */}                            display: 'inline-block',                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '25px' }}>

                    <table width="100%" cellPadding="0" cellSpacing="0">

                      <tr>                            backgroundColor: 'rgba(255,255,255,0.2)',                    <tr>

                        <td align="center" style={{ paddingBottom: '32px' }}>

                          <a                            borderRadius: '50%',                      <td>

                            href="https://gravador-medico.lovable.app/login"

                            style={{                            width: '60px',                        <p style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 15px 0', fontWeight: 'bold' }}>

                              display: 'inline-block',

                              backgroundColor: colors.primary,                            height: '60px',                          📋 Detalhes do Pedido

                              color: '#FFFFFF',

                              padding: '16px 48px',                            lineHeight: '60px',                        </p>

                              borderRadius: '8px',

                              textDecoration: 'none',                            fontSize: '30px',                        

                              fontWeight: '600',

                              fontSize: '16px',                            textAlign: 'center'                        <table width="100%" cellPadding="8" cellSpacing="0">

                              boxShadow: '0 4px 14px rgba(22, 160, 133, 0.4)',

                            }}                          }}>                          <tr>

                          >

                            Acessar o Sistema →                            🎙️                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Número do Pedido:</td>

                          </a>

                        </td>                          </span>                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>#{orderId}</td>

                      </tr>

                    </table>                        </td>                          </tr>



                    {/* Detalhes do Pedido */}                      </tr>                          <tr>

                    <table

                      width="100%"                      <tr>                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Valor:</td>

                      cellPadding="0"

                      cellSpacing="0"                        <td align="center">                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>

                      style={{

                        backgroundColor: colors.background,                          <h1 style={{                               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderValue)}

                        borderRadius: '8px',

                        border: `1px solid ${colors.border}`,                            color: '#ffffff',                             </td>

                      }}

                    >                            margin: 0,                           </tr>

                      <tr>

                        <td style={{ padding: '20px' }}>                            fontSize: '26px',                           <tr>

                          <p style={{

                            color: colors.textSecondary,                            fontWeight: '700',                            <td style={{ color: '#6b7280', fontSize: '14px' }}>Método de Pagamento:</td>

                            fontSize: '13px',

                            margin: '0 0 12px 0',                            letterSpacing: '-0.5px'                            <td align="right" style={{ color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>{paymentMethod}</td>

                            fontWeight: '600',

                          }}>                          }}>                          </tr>

                            Detalhes do Pedido:

                          </p>                            Bem-vindo ao Gravador Médico!                        </table>

                          <table width="100%" cellPadding="0" cellSpacing="0">

                            <tr>                          </h1>                      </td>

                              <td style={{ paddingBottom: '8px' }}>

                                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Produto:</span>                          <p style={{                     </tr>

                              </td>

                              <td style={{ paddingBottom: '8px', textAlign: 'right' }}>                            color: 'rgba(255,255,255,0.9)',                   </table>

                                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>Gravador Médico</span>

                              </td>                            margin: '12px 0 0 0', 

                            </tr>

                            <tr>                            fontSize: '15px',                  {/* Support Info */}

                              <td style={{ paddingBottom: '8px' }}>

                                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Pedido:</span>                            fontWeight: '500'                  <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '25px' }}>

                              </td>

                              <td style={{ paddingBottom: '8px', textAlign: 'right' }}>                          }}>                    <tr>

                                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{formatOrderId(orderId)}</span>

                              </td>                            Sua compra foi aprovada com sucesso ✨                      <td>

                            </tr>

                            <tr>                          </p>                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>

                              <td style={{ paddingBottom: '8px' }}>

                                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Valor:</span>                        </td>                          💬 <strong>Precisa de ajuda?</strong><br />

                              </td>

                              <td style={{ paddingBottom: '8px', textAlign: 'right' }}>                      </tr>                          Nossa equipe está disponível para te ajudar no WhatsApp ou por email.

                                <span style={{ color: colors.primary, fontSize: '14px', fontWeight: '700' }}>R$ {orderValue.toFixed(2)}</span>

                              </td>                    </table>                        </p>

                            </tr>

                            <tr>                  </td>                      </td>

                              <td>

                                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>Pagamento:</span>                </tr>                    </tr>

                              </td>

                              <td style={{ textAlign: 'right' }}>                  </table>

                                <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>{formatPaymentMethod(paymentMethod)}</span>

                              </td>                {/* Content */}

                            </tr>

                          </table>                <tr>                </td>

                        </td>

                      </tr>                  <td style={{ padding: '40px 30px' }}>              </tr>

                    </table>

                  </td>                    <p style={{ 

                </tr>

                      color: colors.textPrimary,               {/* Footer */}

                {/* Footer */}

                <tr>                      fontSize: '16px',               <tr>

                  <td

                    style={{                      lineHeight: '1.6',                 <td style={{ backgroundColor: '#f8fafc', padding: '30px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>

                      backgroundColor: colors.background,

                      padding: '24px 40px',                      margin: '0 0 20px 0'                   <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 10px 0' }}>

                      borderTop: `1px solid ${colors.border}`,

                    }}                    }}>                    © 2026 Gravador Médico - Todos os direitos reservados

                  >

                    <p style={{                      Olá, <strong>{customerName}</strong>! 👋                  </p>

                      color: colors.textSecondary,

                      fontSize: '13px',                    </p>                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>

                      lineHeight: '1.6',

                      margin: '0 0 8px 0',                                        🩺 Economize 3h/dia com IA médica

                      textAlign: 'center',

                    }}>                    <p style={{                   </p>

                      Dúvidas? Responda este e-mail ou acesse nosso suporte.

                    </p>                      color: colors.textSecondary,                 </td>

                    <p style={{

                      color: colors.textSecondary,                      fontSize: '15px',               </tr>

                      fontSize: '12px',

                      margin: 0,                      lineHeight: '1.7', 

                      textAlign: 'center',

                    }}>                      margin: '0 0 30px 0'             </table>

                      © 2026 Gravador Médico - Todos os direitos reservados

                    </p>                    }}>          </td>

                  </td>

                </tr>                      Parabéns pela sua compra! Seu acesso ao <strong style={{ color: colors.textPrimary }}>Gravador Médico</strong> já está liberado.         </tr>

              </table>

            </td>                      Use as credenciais abaixo para fazer login:      </table>

          </tr>

        </table>                    </p>    </body>

      </body>

    </html>  </html>

  )

}                    {/* Credentials Box */})



export default WelcomeEmail                    <table 

                      role="presentation"
                      width="100%" 
                      cellPadding="0" 
                      cellSpacing="0" 
                      style={{ 
                        backgroundColor: colors.muted, 
                        border: `1px solid ${colors.border}`, 
                        borderRadius: '10px', 
                        marginBottom: '30px' 
                      }}
                    >
                      <tr>
                        <td style={{ padding: '25px' }}>
                          <p style={{ 
                            color: colors.primary, 
                            fontSize: '14px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px', 
                            margin: '0 0 20px 0', 
                            fontWeight: '700' 
                          }}>
                            🔐 Seus Dados de Acesso
                          </p>
                          
                          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{ paddingBottom: '15px' }}>
                                <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '0 0 6px 0', fontWeight: '500' }}>
                                  E-mail:
                                </p>
                                <p style={{ 
                                  color: colors.textPrimary, 
                                  fontSize: '15px', 
                                  fontWeight: '600', 
                                  margin: 0, 
                                  fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
                                  backgroundColor: colors.card,
                                  padding: '12px 14px',
                                  borderRadius: '8px',
                                  border: `1px solid ${colors.border}`
                                }}>
                                  {userEmail}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '0 0 6px 0', fontWeight: '500' }}>
                                  Senha Temporária:
                                </p>
                                <p style={{ 
                                  color: colors.textPrimary, 
                                  fontSize: '15px', 
                                  fontWeight: '600', 
                                  margin: 0, 
                                  fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
                                  backgroundColor: colors.card,
                                  padding: '12px 14px',
                                  borderRadius: '8px',
                                  border: `1px solid ${colors.border}`
                                }}>
                                  {userPassword}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* CTA Button */}
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '30px' }}>
                      <tr>
                        <td align="center">
                          <a 
                            href="https://gravador-medico.lovable.app/login" 
                            style={{ 
                              display: 'inline-block',
                              backgroundColor: colors.primary,
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '16px 48px',
                              borderRadius: '10px',
                              fontSize: '16px',
                              fontWeight: '600',
                              boxShadow: '0 4px 14px rgba(22, 160, 133, 0.35)',
                              letterSpacing: '0.3px'
                            }}
                          >
                            Acessar o Sistema →
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Order Details */}
                    <table 
                      role="presentation"
                      width="100%" 
                      cellPadding="0" 
                      cellSpacing="0" 
                      style={{ 
                        backgroundColor: colors.background, 
                        borderRadius: '10px', 
                        border: `1px solid ${colors.border}`,
                        marginTop: '10px'
                      }}
                    >
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <p style={{ 
                            color: colors.textSecondary, 
                            fontSize: '13px', 
                            margin: '0 0 12px 0', 
                            fontWeight: '500' 
                          }}>
                            Detalhes da Compra:
                          </p>
                          
                          <table role="presentation" width="100%" cellPadding="6" cellSpacing="0">
                            <tr>
                              <td style={{ color: colors.textSecondary, fontSize: '14px' }}>Produto:</td>
                              <td align="right" style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                                Gravador Médico
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: colors.textSecondary, fontSize: '14px' }}>Pedido:</td>
                              <td align="right" style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                                #{formatOrderId(orderId)}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: colors.textSecondary, fontSize: '14px' }}>Valor:</td>
                              <td align="right" style={{ color: colors.success, fontSize: '14px', fontWeight: '700' }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderValue)}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ color: colors.textSecondary, fontSize: '14px' }}>Pagamento:</td>
                              <td align="right" style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '600' }}>
                                {formatPaymentMethod(paymentMethod)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ 
                    backgroundColor: colors.background, 
                    padding: '25px 30px', 
                    textAlign: 'center',
                    borderTop: `1px solid ${colors.border}`
                  }}>
                    <p style={{ 
                      color: colors.textSecondary, 
                      fontSize: '13px', 
                      margin: '0 0 10px 0',
                      lineHeight: '1.6'
                    }}>
                      Dúvidas? Responda este e-mail ou fale conosco no WhatsApp.
                    </p>
                    <p style={{ 
                      color: colors.textSecondary, 
                      fontSize: '12px', 
                      margin: 0,
                      opacity: 0.8
                    }}>
                      © 2026 Gravador Médico — Todos os direitos reservados
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
}

export default WelcomeEmail
