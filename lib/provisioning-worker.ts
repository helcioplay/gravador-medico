import { supabaseAdmin } from './supabase'
import { createLovableUser, generateSecurePassword } from '@/services/lovable-integration'

/**
 * 🏭 PROVISIONING WORKER
 * 
 * Processa fila de provisionamento (criação de usuários + envio de email)
 * 
 * Features:
 * - ✅ Processa fila provisioning_queue
 * - ✅ Atualiza máquina de estados: paid → provisioning → active
 * - ✅ Retry automático (até 3 tentativas)
 * - ✅ Logs detalhados em integration_logs
 * - ✅ Marca provisioning_failed se esgotar tentativas
 */

interface ProvisioningResult {
  success: boolean
  processed: number
  failed: number
  errors: Array<{
    sale_id: string
    error: string
  }>
}

export async function processProvisioningQueue(): Promise<ProvisioningResult> {
  const startTime = Date.now()
  
  console.log('🏭 [PROVISIONING] Iniciando processamento da fila...')

  const result: ProvisioningResult = {
    success: true,
    processed: 0,
    failed: 0,
    errors: []
  }

  try {
    // =====================================================
    // 1️⃣ BUSCAR ITENS PENDENTES NA FILA
    // =====================================================
    
    const { data: queueItems, error: queueError} = await supabaseAdmin
      .from('provisioning_queue')
      .select('*')
      .in('status', ['pending', 'failed'])
      .or('next_retry_at.is.null,next_retry_at.lte.now()') // Sem retry agendado ou já passou a hora
      .order('created_at', { ascending: true })
      .limit(10) // Processar no máximo 10 por vez

    if (queueError) {
      console.error('❌ Erro ao buscar fila:', queueError)
      throw queueError
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('ℹ️ Nenhum item na fila para processar')
      return result
    }

    console.log(`📋 Encontrados ${queueItems.length} itens para processar`)

    // =====================================================
    // 2️⃣ PROCESSAR CADA ITEM
    // =====================================================
    
    for (const item of queueItems) {
      const itemStartTime = Date.now()
      
      try {
        const saleId = item.sale_id || item.order_id

        if (!saleId) {
          throw new Error('Fila sem sale_id (registro inválido)')
        }

        console.log(`\n🔄 Processando pedido: ${saleId}`)

        // Buscar dados do pedido - primeiro tenta em sales, depois em orders
        let order = null
        let orderTable = 'sales'
        
        // Tentar buscar na tabela sales primeiro
        const { data: salesOrder, error: salesError } = await supabaseAdmin
          .from('sales')
          .select('*')
          .eq('id', saleId)
          .maybeSingle()

        if (salesOrder) {
          order = salesOrder
          orderTable = 'sales'
        } else {
          // Tentar buscar na tabela orders
          const { data: ordersOrder, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', saleId)
            .maybeSingle()

          if (ordersOrder) {
            order = ordersOrder
            orderTable = 'orders'
          }
        }

        if (!order) {
          throw new Error(`Pedido não encontrado em sales nem orders: ${saleId}`)
        }

        console.log(`📋 Pedido encontrado na tabela: ${orderTable}`)

        const maxRetries = item.max_retries ?? 3
        if ((item.retry_count ?? 0) >= maxRetries) {
          console.log(`⚠️ Pedido ${saleId} atingiu o máximo de retries (${maxRetries}), pulando...`)
          continue
        }

        // Validar que pedido está pago - checar ambos os campos possíveis
        const orderStatus = order.order_status || order.status
        if (orderStatus !== 'paid' && orderStatus !== 'approved') {
          console.log(`⚠️ Pedido não está pago (status: ${orderStatus}), pulando...`)
          continue
        }

        // =====================================================
        // 3️⃣ ATUALIZAR STATUS: paid → provisioning
        // =====================================================
        
        // Atualizar na tabela correta
        if (orderTable === 'sales') {
          await supabaseAdmin
            .from('sales')
            .update({ order_status: 'provisioning' })
            .eq('id', order.id)
        } else {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'provisioning' })
            .eq('id', order.id)
        }

        await supabaseAdmin
          .from('provisioning_queue')
          .update({ status: 'processing' })
          .eq('id', item.id)

        console.log('📝 Status atualizado: paid → provisioning')

        // =====================================================
        // 4️⃣ CRIAR USUÁRIO NO LOVABLE
        // =====================================================
        
        console.log('👤 Criando usuário no Lovable...')
        
        const password = generateSecurePassword()
        
        const userResult = await createLovableUser({
          email: order.customer_email,
          password: password,
          full_name: order.customer_name
        })

        if (!userResult.success) {
          throw new Error(`Falha ao criar usuário: ${userResult.error}`)
        }

        console.log('✅ Usuário criado no Lovable:', userResult.user?.id)

        // Log de sucesso
        await supabaseAdmin.from('integration_logs').insert({
          order_id: order.id,
          action: 'create_user_lovable',
          status: 'success',
          recipient_email: order.customer_email,
          user_id: userResult.user?.id,
          details: {
            password: password, // ⚠️ Armazenar temporariamente para email
            user: userResult.user
          },
          duration_ms: Date.now() - itemStartTime
        })

        // =====================================================
        // 5️⃣ ENVIAR EMAIL COM CREDENCIAIS (COM PROTEÇÃO DE IDEMPOTÊNCIA)
        // =====================================================
        
        console.log('📧 Verificando se email já foi enviado anteriormente...')
        
        // ✅ IDEMPOTÊNCIA: Verificar se já existe email enviado com sucesso
        const { data: existingEmailLog, error: logCheckError } = await supabaseAdmin
          .from('integration_logs')
          .select('id, created_at')
          .eq('order_id', order.id)
          .eq('action', 'send_email')
          .eq('status', 'success')
          .maybeSingle()

        if (logCheckError) {
          console.warn('⚠️ Erro ao verificar logs de email:', logCheckError)
        }

        if (existingEmailLog) {
          console.log(`✅ Email já foi enviado anteriormente em ${existingEmailLog.created_at}`)
          console.log('⏭️ Pulando envio de email (evitando duplicata)')
          
          // Log de skip (para auditoria)
          await supabaseAdmin.from('integration_logs').insert({
            order_id: order.id,
            action: 'send_email',
            status: 'skipped',
            recipient_email: order.customer_email,
            details: {
              reason: 'email_already_sent',
              previous_email_sent_at: existingEmailLog.created_at,
              skipped_at: new Date().toISOString()
            },
            duration_ms: 0
          })
        } else {
          // Email ainda não foi enviado, proceder com envio
          console.log('📧 Enviando email de boas-vindas...')
          
          const { sendWelcomeEmail } = await import('./email')
          
          const emailResult = await sendWelcomeEmail({
            to: order.customer_email,
            customerName: order.customer_name,
            userEmail: order.customer_email,
            userPassword: password,
            orderId: order.id.toString(),
            orderValue: Number(order.total_amount ?? order.amount ?? 0),
            paymentMethod: order.payment_gateway === 'mercadopago'
              ? 'Mercado Pago'
              : order.payment_gateway === 'appmax'
                ? 'AppMax'
                : (order.payment_gateway || order.payment_method || 'checkout')
          })
          
          // Log imediato do resultado do email
          await supabaseAdmin.from('integration_logs').insert({
            order_id: order.id,
            action: 'send_email',
            status: emailResult.success ? 'success' : 'error',
            recipient_email: order.customer_email,
            error_message: emailResult.error || null,
            details: {
              email_id: emailResult.emailId,
              password_sent: !!password,
              sent_at: new Date().toISOString()
            },
            duration_ms: Date.now() - itemStartTime
          })
          
          if (emailResult.success) {
            console.log('✅ Email enviado com sucesso!')
          } else {
            console.error('❌ Falha ao enviar email:', emailResult.error)
            throw new Error(`Falha ao enviar email: ${emailResult.error}`)
          }
        }

        // =====================================================
        // 6️⃣ FINALIZAR: provisioning → active
        // =====================================================
        
        await supabaseAdmin
          .from('sales')
          .update({ order_status: 'active' })
          .eq('id', order.id)

        await supabaseAdmin
          .from('provisioning_queue')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id)

        console.log(`✅ Pedido ${order.id} ativado com sucesso!`)
        result.processed++

      } catch (itemError: any) {
        const catchSaleId = item.sale_id || item.order_id || 'unknown'
        console.error(`❌ Erro ao processar item ${item.id}:`, itemError)

        result.failed++
        result.errors.push({
          sale_id: catchSaleId,
          error: itemError.message
        })

        // =====================================================
        // 7️⃣ TRATAMENTO DE ERRO COM RETRY
        // =====================================================
        
        const newRetryCount = (item.retry_count || 0) + 1
        const maxRetries = item.max_retries || 3
        const saleIdForRetry = item.sale_id || item.order_id

        if (newRetryCount >= maxRetries) {
          // Esgotou tentativas - marcar como falha permanente
          console.log(`❌ Esgotadas ${maxRetries} tentativas, marcando como falha permanente`)

          // Tentar atualizar em sales, se não existir tenta orders
          const { error: salesUpdateError } = await supabaseAdmin
            .from('sales')
            .update({ order_status: 'provisioning_failed' })
            .eq('id', saleIdForRetry)

          if (salesUpdateError) {
            await supabaseAdmin
              .from('orders')
              .update({ status: 'provisioning_failed' })
              .eq('id', saleIdForRetry)
          }

          await supabaseAdmin
            .from('provisioning_queue')
            .update({
              status: 'failed',
              retry_count: newRetryCount,
              last_error: itemError.message,
              error_details: {
                message: itemError.message,
                stack: itemError.stack,
                timestamp: new Date().toISOString()
              }
            })
            .eq('id', item.id)

          // Log de erro permanente
          await supabaseAdmin.from('integration_logs').insert({
            order_id: saleIdForRetry,
            action: 'create_user_lovable',
            status: 'error',
            recipient_email: item.order?.customer_email,
            error_message: itemError.message,
            details: {
              retry_count: newRetryCount,
              max_retries: maxRetries,
              permanent_failure: true
            },
            duration_ms: Date.now() - itemStartTime
          })

        } else {
          // Agendar próximo retry (exponential backoff)
          const delayMinutes = Math.pow(2, newRetryCount) * 5 // 5min, 10min, 20min
          const nextRetryAt = new Date(Date.now() + delayMinutes * 60 * 1000)

          console.log(`🔄 Agendando retry ${newRetryCount}/${maxRetries} para ${nextRetryAt.toISOString()}`)

          await supabaseAdmin
            .from('provisioning_queue')
            .update({
              status: 'failed',
              retry_count: newRetryCount,
              last_error: itemError.message,
              next_retry_at: nextRetryAt.toISOString(),
              error_details: {
                message: itemError.message,
                timestamp: new Date().toISOString(),
                retry_count: newRetryCount
              }
            })
            .eq('id', item.id)

          // Voltar status do pedido para paid (para tentar novamente)
          const { error: salesRetryError } = await supabaseAdmin
            .from('sales')
            .update({ order_status: 'paid' })
            .eq('id', saleIdForRetry)

          if (salesRetryError) {
            await supabaseAdmin
              .from('orders')
              .update({ status: 'paid' })
              .eq('id', saleIdForRetry)
          }

          // Log de erro temporário
          await supabaseAdmin.from('integration_logs').insert({
            order_id: saleIdForRetry,
            action: 'create_user_lovable',
            status: 'error',
            recipient_email: item.order?.customer_email,
            error_message: itemError.message,
            details: {
              retry_count: newRetryCount,
              max_retries: maxRetries,
              next_retry_at: nextRetryAt.toISOString(),
              will_retry: true
            },
            duration_ms: Date.now() - itemStartTime
          })
        }
      }
    }

    // =====================================================
    // 8️⃣ RESUMO DO PROCESSAMENTO
    // =====================================================
    
    const duration = Date.now() - startTime
    
    console.log('\n📊 Resumo do processamento:')
    console.log(`  ✅ Processados: ${result.processed}`)
    console.log(`  ❌ Falhas: ${result.failed}`)
    console.log(`  ⏱️ Tempo: ${duration}ms`)

    if (result.errors.length > 0) {
      console.log('  Erros:')
      result.errors.forEach(err => {
        console.log(`    - Pedido ${err.sale_id}: ${err.error}`)
      })
    }

    return result

  } catch (error: any) {
    console.error('❌ Erro crítico no processamento da fila:', error)
    
    result.success = false
    result.errors.push({
      sale_id: 'system',
      error: error.message
    })

    return result
  }
}

/**
 * Processar um pedido específico manualmente (para retry no admin)
 */
export async function processSpecificOrder(orderId: string): Promise<{
  success: boolean
  message: string
}> {
  console.log(`🔧 [MANUAL] Reprocessando pedido: ${orderId}`)

  try {
    // Verificar se existe na fila (compatível com sale_id/order_id)
    let queueItem: any = null

    const { data: queueBySale, error: queueBySaleError } = await supabaseAdmin
      .from('provisioning_queue')
      .select('*')
      .eq('sale_id', orderId)
      .maybeSingle()

    if (queueBySaleError && !queueBySaleError.message?.includes('sale_id')) {
      throw queueBySaleError
    }

    if (queueBySale) {
      queueItem = queueBySale
    } else if (queueBySaleError?.message?.includes('sale_id')) {
      const { data: queueByOrder, error: queueByOrderError } = await supabaseAdmin
        .from('provisioning_queue')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle()

      if (queueByOrderError && !queueByOrderError.message?.includes('order_id')) {
        throw queueByOrderError
      }

      queueItem = queueByOrder
    }

    if (!queueItem) {
      // Criar entrada na fila
      // Inserir na fila com fallback de coluna
      const { error: insertSaleError } = await supabaseAdmin
        .from('provisioning_queue')
        .insert({
          sale_id: orderId,
          status: 'pending',
          retry_count: 0
        })

      if (insertSaleError?.message?.includes('sale_id')) {
        const { error: insertOrderError } = await supabaseAdmin
          .from('provisioning_queue')
          .insert({
            order_id: orderId,
            status: 'pending',
            retry_count: 0
          })

        if (insertOrderError) {
          throw insertOrderError
        }
      } else if (insertSaleError) {
        throw insertSaleError
      }
    } else {
      // Resetar para pending
      await supabaseAdmin
        .from('provisioning_queue')
        .update({
          status: 'pending',
          next_retry_at: null
        })
        .eq('id', queueItem.id)
    }

    // Processar fila
    const result = await processProvisioningQueue()

    return {
      success: result.processed > 0,
      message: result.processed > 0 
        ? 'Pedido reprocessado com sucesso'
        : 'Erro ao reprocessar pedido'
    }

  } catch (error: any) {
    console.error('❌ Erro ao reprocessar pedido:', error)
    
    return {
      success: false,
      message: error.message
    }
  }
}
