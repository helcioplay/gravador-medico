import { NextRequest, NextResponse } from "next/server"

// SOLUÇÃO REDIRECT - ESTÁVEL E FUNCIONAL
const APPMAX_CHECKOUT_BASE = "https://gravadormedico1768482029857.carrinho.app/one-checkout/ocmdf"
const PRODUCT_IDS = {
  main: process.env.APPMAX_PRODUCT_ID || '32991339',
  bump1: process.env.APPMAX_ORDER_BUMP_1_ID || '32989468',
  bump2: process.env.APPMAX_ORDER_BUMP_2_ID || '32989503',
  bump3: process.env.APPMAX_ORDER_BUMP_3_ID || '32989520',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email || !body.name) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const cleanCpf = body.cpf ? body.cpf.replace(/\D/g, '') : ''
    const cleanPhone = body.phone ? body.phone.replace(/\D/g, '') : ''

    console.log('📦 Checkout - Redirect para Appmax:', {
      name: body.name,
      email: body.email,
      phone: cleanPhone,
      cpf: cleanCpf,
    })

    const checkoutUrl = new URL(`${APPMAX_CHECKOUT_BASE}/${PRODUCT_IDS.main}`)
    checkoutUrl.searchParams.set('name', body.name)
    checkoutUrl.searchParams.set('email', body.email)
    if (cleanPhone) checkoutUrl.searchParams.set('phone', cleanPhone)
    if (cleanCpf) checkoutUrl.searchParams.set('cpf', cleanCpf)

    if (body.utmParams) {
      Object.entries(body.utmParams).forEach(([key, value]) => {
        if (value) checkoutUrl.searchParams.set(key, value as string)
      })
    }

    console.log('🔗 URL:', checkoutUrl.toString())

    return NextResponse.json({
      success: true,
      redirectUrl: checkoutUrl.toString(),
      message: 'Redirecionando para finalizar pagamento...',
    })

  } catch (error: any) {
    console.error("❌ Erro:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
