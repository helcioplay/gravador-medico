#!/usr/bin/env node

const { readFileSync } = require('fs')
const { join } = require('path')

// Ler variáveis de ambiente manualmente
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local')
    const envContent = readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      
      const match = trimmed.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        process.env[key] = value
      }
    })
  } catch (error) {
    console.error('Erro ao carregar .env.local:', error.message)
  }
}

loadEnv()

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarDatasVendas() {
  console.log('🔍 VERIFICANDO DATAS DAS VENDAS')
  console.log('='.repeat(80))
  
  const { data, error } = await supabase
    .from('sales')
    .select('id, appmax_order_id, customer_name, total_amount, status, created_at')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.log('❌ Erro:', error.message)
    return
  }
  
  console.log(`📊 Total de vendas no banco: ${data.length}`)
  console.log('')
  
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  console.log('🕐 Data atual:', now.toISOString())
  console.log('📆 30 dias atrás:', thirtyDaysAgo.toISOString())
  console.log('')
  console.log('VENDAS:')
  console.log('='.repeat(80))
  
  let dentroDaFaixa = 0
  let foraDaFaixa = 0
  
  data.forEach((sale, index) => {
    const saleDate = new Date(sale.created_at)
    const isWithin30Days = saleDate >= thirtyDaysAgo
    const emoji = isWithin30Days ? '✅' : '❌'
    
    if (isWithin30Days) {
      dentroDaFaixa++
    } else {
      foraDaFaixa++
    }
    
    console.log(`${emoji} Venda #${index + 1}:`)
    console.log(`   ID: ${sale.id.substring(0, 8)}...`)
    console.log(`   Order ID: ${sale.appmax_order_id || 'N/A'}`)
    console.log(`   Cliente: ${sale.customer_name}`)
    console.log(`   Valor: R$ ${sale.total_amount}`)
    console.log(`   Status: ${sale.status}`)
    console.log(`   Data criação: ${sale.created_at}`)
    console.log(`   Dentro de 30 dias? ${isWithin30Days ? 'SIM ✅' : 'NÃO ❌'}`)
    console.log('')
  })
  
  console.log('='.repeat(80))
  console.log('📊 RESUMO:')
  console.log(`   ✅ Vendas dentro dos últimos 30 dias: ${dentroDaFaixa}`)
  console.log(`   ❌ Vendas fora dos últimos 30 dias: ${foraDaFaixa}`)
  console.log('='.repeat(80))
  
  if (foraDaFaixa > 0) {
    console.log('')
    console.log('⚠️  PROBLEMA IDENTIFICADO!')
    console.log(`   ${foraDaFaixa} venda(s) estão fora do filtro de 30 dias padrão`)
    console.log('   Isso explica porque não aparecem nas páginas individuais')
    console.log('   (que filtram por data) mas aparecem no dashboard overview')
    console.log('   (que tem fallback para buscar todas as vendas)')
  }
}

verificarDatasVendas()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err)
    process.exit(1)
  })
