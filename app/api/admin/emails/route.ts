// =====================================================
// 📧 API ADMIN - GERENCIAMENTO DE E-MAILS
// =====================================================
// Endpoint: /api/admin/emails
// Métodos: GET
// Descrição: Lista e filtra e-mails enviados pelo sistema
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Base query
    let query = supabaseAdmin
      .from('email_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (status && status !== 'all') {
      if (status === 'opened') {
        query = query.eq('opened', true);
      } else {
        query = query.eq('status', status);
      }
    }

    if (type && type !== 'all') {
      query = query.eq('email_type', type);
    }

    if (search) {
      query = query.or(`recipient_email.ilike.%${search}%,order_id.ilike.%${search}%,recipient_name.ilike.%${search}%`);
    }

    const { data: emails, error, count } = await query;

    if (error) {
      console.error('[API] Erro ao buscar e-mails:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Calcular estatísticas
    const { data: statsData } = await supabaseAdmin
      .from('email_logs')
      .select('status, opened, email_type');

    const stats = {
      total: statsData?.length || 0,
      sent: statsData?.filter((e) => e.status === 'sent').length || 0,
      opened: statsData?.filter((e) => e.opened).length || 0,
      failed: statsData?.filter((e) => e.status === 'failed').length || 0,
      open_rate: statsData?.length
        ? ((statsData.filter((e) => e.opened).length / statsData.length) * 100)
        : 0,
    };

    return NextResponse.json({
      success: true,
      emails: emails || [],
      stats,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });

  } catch (error: any) {
    console.error('[API] Erro ao processar requisição:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint para obter detalhes de um e-mail específico
export async function POST(request: NextRequest) {
  try {
    const { emailId } = await request.json();

    if (!emailId) {
      return NextResponse.json(
        { success: false, error: 'Email ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar e-mail
    const { data: email, error: emailError } = await supabaseAdmin
      .from('email_logs')
      .select('*')
      .eq('id', emailId)
      .single();

    if (emailError || !email) {
      return NextResponse.json(
        { success: false, error: 'E-mail não encontrado' },
        { status: 404 }
      );
    }

    // Buscar eventos do e-mail
    const { data: events } = await supabaseAdmin
      .from('email_events')
      .select('*')
      .eq('email_log_id', emailId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      email,
      events: events || [],
    });

  } catch (error: any) {
    console.error('[API] Erro ao buscar detalhes do e-mail:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
