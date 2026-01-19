import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint de teste para validar integração com API Appmax V3
 * Testa os 3 endpoints principais: customer, order, payment
 */

const APPMAX_API_URL = 'https://admin.appmax.com.br/api/v3'
const APPMAX_API_TOKEN = process.env.APPMAX_API_TOKEN || ''

export async function GET(request: NextRequest) {
  const results: any = {
    token: APPMAX_API_TOKEN ? '✅ Configurado' : '❌ Não configurado',
    tests: {},
  }

  try {
    // TESTE 1: Criar Cliente de Teste
    console.log('\n🧪 TESTE 1: Criar cliente...')
    const customerResponse = await fetch(`${APPMAX_API_URL}/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'access-token': APPMAX_API_TOKEN,
        firstname: 'Teste',
        lastname: 'API',
        email: `teste_${Date.now()}@teste.com`,
        telephone: '11999999999',
        ip: '127.0.0.1',
      }),
    })

    const customerText = await customerResponse.text()
    results.tests.customer = {
      status: customerResponse.status,
      statusText: customerResponse.statusText,
      headers: Object.fromEntries(customerResponse.headers.entries()),
      body: customerText.substring(0, 1000),
    }

    if (!customerResponse.ok) {
      console.error('❌ Erro ao criar cliente:', results.tests.customer)
      return NextResponse.json(results, { status: 200 })
    }

    let customerData
    try {
      customerData = JSON.parse(customerText)
    } catch {
      console.error('❌ Resposta não é JSON:', customerText.substring(0, 500))
      return NextResponse.json(results, { status: 200 })
    }

    const customerId = customerData.data?.id || customerData.customer_id || customerData.id
    console.log('✅ Cliente criado:', customerId)
    results.tests.customer.parsed = customerData
    results.tests.customer.customer_id = customerId

    if (!customerId) {
      console.error('❌ customer_id não retornado')
      return NextResponse.json(results, { status: 200 })
    }

    // TESTE 2: Criar Pedido
    console.log('\n🧪 TESTE 2: Criar pedido...')
    const orderResponse = await fetch(`${APPMAX_API_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'access-token': APPMAX_API_TOKEN,
        customer_id: customerId,
        total: 36.00, // Total do carrinho (API calcula preço unitário)
        products: [
          {
            sku: process.env.APPMAX_PRODUCT_ID || '32991339',
            name: 'Gravador Médico - Teste',
            qty: 1,
            digital_product: 1,
          },
        ],
        shipping: 0,
        discount: 0,
        freight_type: 'Sedex', // Requerido mesmo para produto digital
      }),
    })

    const orderText = await orderResponse.text()
    results.tests.order = {
      status: orderResponse.status,
      statusText: orderResponse.statusText,
      body: orderText.substring(0, 1000),
    }

    if (!orderResponse.ok) {
      console.error('❌ Erro ao criar pedido:', results.tests.order)
      return NextResponse.json(results, { status: 200 })
    }

    let orderData
    try {
      orderData = JSON.parse(orderText)
    } catch {
      console.error('❌ Resposta não é JSON:', orderText.substring(0, 500))
      return NextResponse.json(results, { status: 200 })
    }

    const orderId = orderData.data?.id || orderData.order_id || orderData.id
    console.log('✅ Pedido criado:', orderId)
    results.tests.order.parsed = orderData
    results.tests.order.order_id = orderId

    // TESTE 3: Criar PIX
    console.log('\n🧪 TESTE 3: Testar endpoint de PIX...')
    const pixResponse = await fetch(`${APPMAX_API_URL}/payment/pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'access-token': APPMAX_API_TOKEN,
        cart: {
          order_id: orderId,
        },
        customer: {
          customer_id: customerId,
        },
        payment: {
          pix: {
            document_number: '19100000000', // CPF obrigatório para PIX
          },
        },
      }),
    })

    const pixText = await pixResponse.text()
    results.tests.pix = {
      status: pixResponse.status,
      statusText: pixResponse.statusText,
      body: pixText.substring(0, 1000),
    }

    if (pixResponse.ok) {
      try {
        const pixData = JSON.parse(pixText)
        results.tests.pix.parsed = pixData
        console.log('✅ PIX criado com sucesso!')
      } catch {
        console.log('⚠️ Resposta PIX não é JSON válido')
      }
    } else {
      console.log('ℹ️ Endpoint PIX testado (erro esperado sem dados completos)')
    }

    results.summary = '✅ Testes concluídos! Veja os detalhes acima.'

    return NextResponse.json(results, { status: 200 })

  } catch (error: any) {
    console.error('❌ Erro nos testes:', error)
    results.tests.error = {
      message: error.message,
      stack: error.stack,
    }
    return NextResponse.json(results, { status: 200 })
  }
}
