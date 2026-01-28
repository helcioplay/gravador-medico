import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { ALL_PRODUCTS } from '@/lib/products-config'

// Tipagem do item que vem da Appmax dentro do JSONB
interface AppmaxItem {
  id?: string | number
  product_id?: string | number
  title?: string
  name?: string
  unit_price?: number | string
  price?: number | string
  quantity?: number
  image_url?: string
}

interface ProductPerformance {
  total_sales: number
  total_revenue: number
  refund_rate: number
  conversion_rate: number
  health_score: number
  unique_customers: number
  last_sale_at: string
}

interface Product {
  id: string
  name: string
  price: number
  is_active: boolean
  category: string
  performance?: ProductPerformance
}

/**
 * POST: Sincronizar Produtos do Config
 * 
 * Pega os produtos do products-config.ts (fonte única de verdade)
 * e insere/atualiza na tabela products do Supabase
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    console.log('🔄 Iniciando sincronização de produtos...')

    const results = []

    for (const product of ALL_PRODUCTS) {
      console.log(`📦 Sincronizando: ${product.name}`)

      // Verificar se produto já existe
      const { data: existing } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('external_id', product.appmax_product_id)
        .single()

      const productData = {
        external_id: product.appmax_product_id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url || `https://gravadormedico.com.br/images/${product.sku}.png`,
        category: product.category,
        plan_type: product.type === 'main' ? 'lifetime' : product.type,
        is_active: product.is_active,
        is_featured: product.is_featured,
        checkout_url: product.appmax_checkout_url || null,
        updated_at: new Date().toISOString()
      }

      if (existing) {
        // Atualizar produto existente
        const { error } = await supabaseAdmin
          .from('products')
          .update(productData)
          .eq('id', existing.id)

        if (error) {
          console.error(`❌ Erro ao atualizar ${product.name}:`, error)
          results.push({ product: product.name, status: 'error', error: error.message })
        } else {
          console.log(`✅ Atualizado: ${product.name}`)
          results.push({ product: product.name, status: 'updated' })
        }
      } else {
        // Inserir novo produto
        const { error } = await supabaseAdmin
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error(`❌ Erro ao inserir ${product.name}:`, error)
          results.push({ product: product.name, status: 'error', error: error.message })
        } else {
          console.log(`✅ Criado: ${product.name}`)
          results.push({ product: product.name, status: 'created' })
        }
      }
    }

    // Buscar produtos sincronizados
    const { data: syncedProducts } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('price', { ascending: false })

    console.log('✅ Sincronização concluída!')

    return NextResponse.json({
      success: true,
      message: 'Produtos sincronizados com sucesso',
      results,
      products: syncedProducts,
      summary: {
        total: results.length,
        created: results.filter(r => r.status === 'created').length,
        updated: results.filter(r => r.status === 'updated').length,
        errors: results.filter(r => r.status === 'error').length
      }
    })

  } catch (error: any) {
    console.error('❌ Erro crítico na sincronização:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * GET: Buscar produtos com métricas de performance
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const supabase = supabaseAdmin
    const { searchParams } = new URL(request.url)
    
    const includeInactive = searchParams.get('include_inactive') === 'true'
    const category = searchParams.get('category')

    // 1️⃣ Buscar produtos com join na view de performance
    let query = supabase
      .from('products')
      .select(`
        *,
        performance:product_performance!inner(
          total_sales,
          total_revenue,
          refund_rate,
          conversion_rate,
          health_score,
          unique_customers,
          last_sale_at
        )
      `)
      .order('created_at', { ascending: false })

    // Filtros
    if (!includeInactive) {
      query = query.eq('is_active', true)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      return NextResponse.json(
        { error: 'Falha ao buscar produtos', details: error.message },
        { status: 500 }
      )
    }

    // 2️⃣ Calcular estatísticas globais
    const typedProducts = (products || []) as Product[]
    
    const stats = {
      total_products: typedProducts.length,
      active_products: typedProducts.filter((p: Product) => p.is_active).length,
      total_revenue: typedProducts.reduce((sum: number, p: Product) => sum + (p.performance?.total_revenue || 0), 0),
      avg_health_score: typedProducts.length 
        ? Math.round(typedProducts.reduce((sum: number, p: Product) => sum + (p.performance?.health_score || 0), 0) / typedProducts.length)
        : 0
    }

    return NextResponse.json({
      success: true,
      products: typedProducts,
      stats
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno', message: error.message },
      { status: 500 }
    )
  }
}
