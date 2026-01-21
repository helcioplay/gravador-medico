import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const search = searchParams.get('search')
  const limitParam = Number.parseInt(searchParams.get('limit') || '500', 10)
  const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 1000) : 500

  try {
    let query = supabaseAdmin
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (start) query = query.gte('created_at', start)
    if (end) query = query.lte('created_at', end)
    if (search) {
      const term = search.trim()
      if (term) {
        query = query.or(
          `customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,appmax_order_id.ilike.%${term}%`
        )
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sales: data || [] })
  } catch (error) {
    console.error('Erro ao carregar vendas admin:', error)
    return NextResponse.json({ error: 'Erro ao carregar vendas' }, { status: 500 })
  }
}
