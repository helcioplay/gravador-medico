import { NextRequest, NextResponse } from 'next/server'
import { processProvisioningQueue } from '@/lib/provisioning-worker'

/**
 * 🔄 API para processar manualmente a fila de provisionamento
 * 
 * Uso:
 * POST /api/admin/process-provisioning
 * 
 * Isso vai:
 * 1. Buscar todos os itens pendentes/failed na fila
 * 2. Para cada um: criar usuário no Lovable + enviar email
 * 3. Atualizar status para 'completed' ou 'failed'
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [MANUAL] Iniciando processamento manual da fila de provisionamento...')
    
    const result = await processProvisioningQueue()
    
    console.log('✅ [MANUAL] Processamento concluído:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Fila de provisionamento processada',
      result
    })
    
  } catch (error: any) {
    console.error('❌ [MANUAL] Erro ao processar fila:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao processar fila'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/admin/process-provisioning',
    method: 'POST',
    description: 'Processa manualmente a fila de provisionamento (criação de usuários + envio de emails)'
  })
}
