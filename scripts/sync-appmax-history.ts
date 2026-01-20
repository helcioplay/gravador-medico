/**
 * Script para sincronizar histórico completo de vendas da Appmax
 * 
 * Como usar:
 * 1. Obtenha suas credenciais da Appmax (API Key)
 * 2. Execute este script localmente ou via API route
 * 3. Ele buscará todas as vendas e populará o Supabase
 */

import { createClient } from '@supabase/supabase-js'

const APPMAX_API_URL = 'https://api.appmax.com.br/v1'
const APPMAX_API_KEY = process.env.APPMAX_API_KEY || 'SUA_API_KEY_AQUI'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function syncAppmaxOrders() {
  console.log('🔄 Iniciando sincronização com Appmax...')
  
  try {
    // 1. Buscar todas as vendas da Appmax (últimos 90 dias)
    const response = await fetch(`${APPMAX_API_URL}/orders?limit=1000&days=90`, {
      headers: {
        'Authorization': `Bearer ${APPMAX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar vendas: ${response.statusText}`)
    }

    const orders = await response.json()
    console.log(`📦 Encontradas ${orders.length} vendas na Appmax`)

    // 2. Inserir cada venda no Supabase (usando UPSERT para evitar duplicatas)
    for (const order of orders) {
      const saleData = {
        appmax_order_id: order.id.toString(),
        appmax_customer_id: order.customer?.id?.toString() || null,
        customer_name: order.customer?.name || 'Cliente',
        customer_email: order.customer?.email || '',
        customer_phone: order.customer?.phone || null,
        customer_cpf: order.customer?.document || null,
        subtotal: parseFloat(order.subtotal || 0),
        total_amount: parseFloat(order.total || 0),
        discount_amount: parseFloat(order.discount || 0),
        status: mapStatus(order.status),
        payment_method: order.payment_method || 'unknown',
        utm_source: order.utm_source || null,
        utm_medium: order.utm_medium || null,
        utm_campaign: order.utm_campaign || null,
        created_at: order.created_at,
        updated_at: order.updated_at,
      }

      const { error } = await supabase
        .from('sales')
        .upsert(saleData, { 
          onConflict: 'appmax_order_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error(`❌ Erro ao inserir venda ${order.id}:`, error)
      } else {
        console.log(`✅ Venda ${order.id} sincronizada`)
      }
    }

    console.log('🎉 Sincronização completa!')

  } catch (error) {
    console.error('❌ Erro na sincronização:', error)
  }
}

function mapStatus(appmaxStatus: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'approved': 'approved',
    'paid': 'approved',
    'processing': 'pending',
    'refunded': 'refunded',
    'canceled': 'refused',
    'payment_not_authorized': 'refused',
    'refused': 'refused',
  }
  return statusMap[appmaxStatus.toLowerCase()] || 'pending'
}

// Executar
syncAppmaxOrders()
