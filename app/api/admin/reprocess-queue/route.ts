import { NextRequest, NextResponse } from 'next/server'
import { processProvisioningQueue } from '@/lib/provisioning-worker'

/**
 * 🔄 ENDPOINT DE REPROCESSAMENTO MANUAL DA FILA
 * 
 * **OBJETIVO:**
 * Processar manualmente itens que ficaram "presos" na fila de provisionamento.
 * 
 * **CASOS DE USO:**
 * 1. Webhook falhou e itens ficaram com status 'pending'
 * 2. Lovable estava offline temporariamente
 * 3. Resend teve timeout
 * 4. Debugging e testes
 * 5. Cron Job periódico (a cada 5-10 minutos)
 * 
 * **ENDPOINTS:**
 * - POST /api/admin/reprocess-queue → Executa reprocessamento
 * - GET  /api/admin/reprocess-queue → Mostra informações (útil para Cron)
 * 
 * **EXEMPLO DE USO:**
 * ```bash
 * # Manual
 * curl -X POST https://gravadormedico.com.br/api/admin/reprocess-queue
 * 
 * # Cron Job (Vercel)
 * GET https://gravadormedico.com.br/api/admin/reprocess-queue
 * ```
 */

// ⚠️ CRÍTICO: Desabilitar cache da Vercel
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST - Reprocessar fila manualmente
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🔄 [REPROCESS] Iniciando reprocessamento manual da fila...')
    console.log('🕐 [REPROCESS] Timestamp:', new Date().toISOString())
    
    // Executar worker de provisionamento
    const result = await processProvisioningQueue()
    
    const duration = Date.now() - startTime
    
    console.log('✅ [REPROCESS] Reprocessamento concluído com sucesso')
    console.log('📊 [REPROCESS] Estatísticas:', {
      processed: result.processed,
      failed: result.failed,
      duration_ms: duration
    })
    
    return NextResponse.json({
      success: true,
      message: `Reprocessamento concluído: ${result.processed} processados, ${result.failed} falhas`,
      data: {
        processed: result.processed,
        failed: result.failed,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    }, { status: 200 })
    
  } catch (error: any) {
    const duration = Date.now() - startTime
    
    console.error('❌ [REPROCESS] Erro ao reprocessar fila:', error)
    console.error('📊 [REPROCESS] Contexto do erro:', {
      error_message: error.message,
      error_stack: error.stack,
      duration_ms: duration
    })
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao reprocessar fila',
      error: error.message,
      data: {
        processed: 0,
        failed: 0,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

/**
 * GET - Informações sobre o endpoint (útil para Cron Jobs)
 * 
 * **COMPORTAMENTO:**
 * - Se chamado com query param ?run=true → Executa reprocessamento
 * - Se chamado sem params → Retorna apenas informações
 * 
 * **USO COM CRON:**
 * ```
 * GET /api/admin/reprocess-queue?run=true
 * ```
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shouldRun = searchParams.get('run') === 'true'
  
  // Se ?run=true, executar reprocessamento (útil para Cron Jobs)
  if (shouldRun) {
    const startTime = Date.now()
    
    try {
      console.log('🔄 [REPROCESS-CRON] Iniciando reprocessamento via GET (Cron Job)')
      console.log('🕐 [REPROCESS-CRON] Timestamp:', new Date().toISOString())
      
      const result = await processProvisioningQueue()
      const duration = Date.now() - startTime
      
      console.log('✅ [REPROCESS-CRON] Reprocessamento concluído')
      console.log('📊 [REPROCESS-CRON] Estatísticas:', {
        processed: result.processed,
        failed: result.failed,
        duration_ms: duration
      })
      
      return NextResponse.json({
        success: true,
        message: `Cron executado: ${result.processed} processados, ${result.failed} falhas`,
        data: {
          processed: result.processed,
          failed: result.failed,
          duration_ms: duration,
          timestamp: new Date().toISOString()
        }
      }, { status: 200 })
      
    } catch (error: any) {
      const duration = Date.now() - startTime
      
      console.error('❌ [REPROCESS-CRON] Erro no Cron Job:', error)
      
      return NextResponse.json({
        success: false,
        message: 'Erro no Cron Job',
        error: error.message,
        data: {
          processed: 0,
          failed: 0,
          duration_ms: duration,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 })
    }
  }
  
  // Retornar apenas informações sobre o endpoint
  return NextResponse.json({
    endpoint: '/api/admin/reprocess-queue',
    description: 'Reprocessa manualmente itens pendentes na fila de provisionamento',
    methods: {
      POST: {
        description: 'Executa reprocessamento imediato',
        example: 'curl -X POST https://gravadormedico.com.br/api/admin/reprocess-queue'
      },
      GET: {
        description: 'Mostra informações ou executa com ?run=true',
        examples: [
          'GET /api/admin/reprocess-queue (apenas info)',
          'GET /api/admin/reprocess-queue?run=true (executa - útil para Cron)'
        ]
      }
    },
    use_cases: [
      'Reprocessar vendas que ficaram pendentes após webhook falhar',
      'Executar via Cron Job a cada 5-10 minutos',
      'Debugging e testes de integração',
      'Recuperar vendas após Lovable ou Resend ficarem offline'
    ],
    response_format: {
      success: 'boolean',
      message: 'string',
      data: {
        processed: 'number (itens processados com sucesso)',
        failed: 'number (itens que falharam)',
        duration_ms: 'number (tempo de execução)',
        timestamp: 'string (ISO 8601)'
      }
    }
  }, { status: 200 })
}
