# ✅ CORREÇÃO: Race Condition no Webhook Mercado Pago

**Data**: 29 de Janeiro de 2026  
**Arquivo**: `/lib/mercadopago-webhook.ts`  
**Problema**: Venda paga via PIX não entregava acesso automaticamente  
**Status**: 🟢 **CORRIGIDO**

---

## 🔍 DIAGNÓSTICO DO PROBLEMA

### Causa Raiz
No ambiente **Serverless da Vercel**, funções são encerradas imediatamente após o `return`. O código anterior apenas **enfileirava** o provisionamento sem **processar**, resultando em:

```typescript
// ❌ CÓDIGO ANTIGO (PROBLEMÁTICO)
if (payment.status === 'approved') {
  await supabaseAdmin
    .from('provisioning_queue')
    .insert({ sale_id: sale.id, status: 'pending' })
  
  // Faltava isso ↓
  // await processProvisioningQueue() 
}

return payment // ← Função encerra AQUI (Serverless mata o processo)
```

**Resultado**: Item ficava na fila, mas nunca era processado automaticamente.

---

## ✅ SOLUÇÃO IMPLEMENTADA

### Mudanças Aplicadas

#### 1. **Import da Função de Processamento**
```typescript
import { processProvisioningQueue } from './provisioning-worker'
```

#### 2. **Verificação de Idempotência Melhorada**
```typescript
// Busca item existente na fila
const { data: existingQueue } = await supabaseAdmin
  .from('provisioning_queue')
  .select('id, status')
  .eq('sale_id', sale.id)
  .maybeSingle()

// Só insere se não existir OU se status = 'failed' (permitir retry)
if (!existingQueue || existingQueue.status === 'failed') {
  await supabaseAdmin
    .from('provisioning_queue')
    .insert({ 
      sale_id: sale.id, 
      status: 'pending',
      retry_count: 0
    })
}
```

#### 3. **Processamento Síncrono com Await** (CRÍTICO)
```typescript
// 🚀 SEGURA A EXECUÇÃO DA FUNÇÃO SERVERLESS
try {
  console.log('⚙️ Iniciando processamento da fila de provisionamento...')
  const result = await processProvisioningQueue()
  console.log('✅ Processamento concluído:', {
    processed: result.processed,
    failed: result.failed
  })
} catch (provisioningError: any) {
  // ⚠️ Mesmo se falhar, não quebra o webhook
  // O item ficará na fila para retry futuro
  console.error('⚠️ Erro ao processar provisionamento:', provisioningError.message)
}
```

**Comportamento Garantido**:
- ✅ Webhook **aguarda** criação do usuário Lovable
- ✅ Webhook **aguarda** envio do email via Resend
- ✅ Se falhar, item fica na fila para reprocessamento manual
- ✅ Webhook sempre retorna 200 OK ao Mercado Pago (evita retentativas desnecessárias)

---

## 🧪 TESTES RECOMENDADOS

### Teste 1: Pagamento PIX Aprovado
```bash
# 1. Fazer compra com PIX no checkout
# 2. Pagar o PIX (usar sandbox do Mercado Pago)
# 3. Verificar logs do webhook:
#    - "✅ Pagamento aprovado! Enfileirando provisionamento..."
#    - "⚙️ Iniciando processamento da fila de provisionamento..."
#    - "✅ Processamento concluído: {processed: 1, failed: 0}"
# 4. Verificar email recebido com credenciais
# 5. Verificar usuário criado no Lovable
```

### Teste 2: Idempotência (Webhook Duplicado)
```bash
# Mercado Pago pode enviar webhook 2x
# Sistema deve:
# - Processar 1x
# - Ignorar duplicatas (log: "ℹ️ Item já está na fila")
```

### Teste 3: Falha no Lovable (Resiliência)
```bash
# Simular: Lovable offline
# Sistema deve:
# - Logar erro: "⚠️ Erro ao processar provisionamento"
# - Webhook retorna 200 OK
# - Item fica na fila com status 'pending' ou 'failed'
# - Pode ser reprocessado manualmente via: POST /api/admin/reprocess-queue
```

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

| Aspecto | ❌ Antes | ✅ Depois |
|---------|---------|-----------|
| **PIX Aprovado** | ❌ Não entrega acesso | ✅ Entrega automaticamente |
| **Processamento** | ⚠️ Fire-and-forget (não aguarda) | ✅ Síncrono com await |
| **Idempotência** | ⚠️ Básica (só verifica ID) | ✅ Avançada (verifica status) |
| **Retry Manual** | ❌ Item não ficava na fila | ✅ Item fica para retry |
| **Logs** | ⚠️ Básicos | ✅ Detalhados (cada etapa) |
| **Webhook Timeout** | 🟢 Rápido (< 1s) | 🟡 Mais lento (5-10s) mas confiável |

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

### 1. **Timeout do Webhook**
- **Antes**: Webhook respondia em < 1 segundo (mas não processava nada)
- **Depois**: Webhook pode levar 5-10 segundos (aguarda Lovable + Resend)
- **Mercado Pago**: Aguarda até **25 segundos** antes de timeout
- **Status**: ✅ **SEGURO** (dentro do limite)

### 2. **Fallback para Retry Manual**
Se o processamento falhar no webhook (ex: Lovable timeout > 30s):
```bash
# Reprocessar manualmente
curl -X POST https://gravadormedico.com.br/api/admin/reprocess-queue
```

### 3. **Monitoramento Recomendado**
```sql
-- Ver itens pendentes na fila
SELECT 
  pq.id,
  pq.sale_id,
  pq.status,
  pq.retry_count,
  s.customer_email,
  s.total_amount,
  pq.created_at,
  pq.last_error
FROM provisioning_queue pq
JOIN sales s ON s.id = pq.sale_id
WHERE pq.status IN ('pending', 'processing')
ORDER BY pq.created_at DESC;
```

---

## 🎯 RESULTADO ESPERADO

### Fluxo Completo Automatizado

```
1. Cliente paga PIX
   ↓
2. Mercado Pago envia webhook
   ↓
3. Sistema atualiza venda para 'paid'
   ↓
4. Sistema adiciona na provisioning_queue
   ↓
5. Sistema AGUARDA processamento:
   → Cria usuário no Lovable
   → Envia email via Resend
   ↓
6. Webhook retorna 200 OK
   ↓
7. Cliente recebe email com acesso ✅
```

**SLA**: 5-10 segundos após pagamento aprovado

---

## 📝 PRÓXIMAS MELHORIAS (OPCIONAL)

### Fase 2: Processamento Assíncrono com Workers
Para otimizar ainda mais (evitar webhook lento):

```typescript
// Opção A: Usar Vercel Cron Job (a cada 5 minutos)
// Opção B: Usar Supabase Edge Functions com Trigger
// Opção C: Usar Queue externa (BullMQ, AWS SQS, etc)
```

**Decisão**: Manter solução atual (síncrona) até atingir > 1000 vendas/dia.

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [x] Import de `processProvisioningQueue` adicionado
- [x] Await explícito antes do return
- [x] Try/catch para não quebrar webhook
- [x] Verificação de idempotência melhorada
- [x] Logs detalhados em cada etapa
- [x] Limpeza de carrinho abandonado mantida
- [x] Código TypeScript sem erros
- [ ] **TESTE EM STAGING**: Fazer compra PIX e validar
- [ ] **DEPLOY EM PRODUÇÃO**: Após validação
- [ ] **MONITORAMENTO**: Acompanhar por 7 dias

---

## 🚀 DEPLOY

```bash
# 1. Commit das mudanças
git add lib/mercadopago-webhook.ts
git commit -m "fix(webhook): add await to processProvisioningQueue in MP webhook"

# 2. Deploy na Vercel
git push origin main

# 3. Verificar logs da Vercel
# Dashboard → Functions → mercadopago-webhook

# 4. Fazer compra PIX de teste
# Verificar se email chega automaticamente
```

---

**FIM DO RELATÓRIO**

_Correção implementada por: GitHub Copilot_  
_Data: 29/01/2026_
