// =====================================================
// 📊 API DE TRACKING DE ABERTURA DE E-MAIL
// =====================================================
// Endpoint: /api/track/email/[emailId]/open
// Método: GET
// Descrição: Registra abertura de e-mail via pixel de rastreamento
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Pixel transparente 1x1 em base64
const TRACKING_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

export async function GET(
  request: NextRequest,
  { params }: { params: { emailId: string } }
) {
  const { emailId } = params;
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'Unknown';

  try {
    // Buscar e-mail no banco
    const { data: emailLog, error: fetchError } = await supabaseAdmin
      .from('email_logs')
      .select('id, opened, open_count, first_opened_at, opened_at, user_agent, ip_address')
      .eq('email_id', emailId)
      .single();

    if (fetchError || !emailLog) {
      console.warn(`[TRACKING] E-mail não encontrado: ${emailId}`);
      // Retornar pixel mesmo se não encontrar o e-mail
      return new NextResponse(TRACKING_PIXEL, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    const now = new Date().toISOString();
    const isFirstOpen = !emailLog.opened;

    // Extrair informações do User-Agent
    const deviceInfo = parseUserAgent(userAgent);

    // Atualizar contador de abertura
    const { error: updateError } = await supabaseAdmin
      .from('email_logs')
      .update({
        opened: true,
        open_count: (emailLog.open_count || 0) + 1,
        first_opened_at: emailLog.first_opened_at || now,
        last_opened_at: now,
        opened_at: emailLog.opened_at || now, // Compatibilidade
        user_agent: isFirstOpen ? userAgent : emailLog.user_agent,
        ip_address: isFirstOpen ? ip : emailLog.ip_address,
        device_type: isFirstOpen ? deviceInfo.device : undefined,
        browser: isFirstOpen ? deviceInfo.browser : undefined,
        os: isFirstOpen ? deviceInfo.os : undefined,
      })
      .eq('id', emailLog.id);

    if (updateError) {
      console.error('[TRACKING] Erro ao atualizar e-mail:', updateError);
    }

    // Registrar evento de abertura
    await supabaseAdmin.from('email_events').insert({
      email_log_id: emailLog.id,
      event_type: 'opened',
      event_data: {
        is_first_open: isFirstOpen,
        open_number: (emailLog.open_count || 0) + 1,
        timestamp: now,
      },
      user_agent: userAgent,
      ip_address: ip,
    });

    console.log(`[TRACKING] E-mail aberto: ${emailId} (${isFirstOpen ? 'primeira vez' : `abertura #${(emailLog.open_count || 0) + 1}`})`);

  } catch (error) {
    console.error('[TRACKING] Erro ao processar abertura:', error);
  }

  // Sempre retornar o pixel transparente
  return new NextResponse(TRACKING_PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// =====================================================
// 🔍 PARSER DE USER-AGENT
// =====================================================
function parseUserAgent(ua: string): {
  device: string;
  browser: string;
  os: string;
} {
  const userAgent = ua.toLowerCase();

  // Detectar device
  let device = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent)) {
    device = 'mobile';
  } else if (/ipad|tablet|kindle/i.test(userAgent)) {
    device = 'tablet';
  }

  // Detectar browser
  let browser = 'Unknown';
  if (userAgent.includes('edg/')) {
    browser = 'Edge';
  } else if (userAgent.includes('chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('opera') || userAgent.includes('opr/')) {
    browser = 'Opera';
  } else if (userAgent.includes('msie') || userAgent.includes('trident/')) {
    browser = 'Internet Explorer';
  }

  // Detectar OS
  let os = 'Unknown';
  if (userAgent.includes('windows nt 10.0')) {
    os = 'Windows 10';
  } else if (userAgent.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (userAgent.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (userAgent.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (userAgent.includes('windows')) {
    os = 'Windows';
  } else if (userAgent.includes('mac os x')) {
    const match = userAgent.match(/mac os x (\d+)[._](\d+)/);
    os = match ? `macOS ${match[1]}.${match[2]}` : 'macOS';
  } else if (userAgent.includes('iphone')) {
    os = 'iOS (iPhone)';
  } else if (userAgent.includes('ipad')) {
    os = 'iOS (iPad)';
  } else if (userAgent.includes('android')) {
    const match = userAgent.match(/android (\d+\.?\d*)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (userAgent.includes('linux')) {
    os = 'Linux';
  }

  return { device, browser, os };
}
