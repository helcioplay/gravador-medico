-- =====================================================
-- ADICIONAR STATUS DE ANÁLISE ANTIFRAUDE
-- =====================================================
-- Criado em: 26/01/2026
-- Descrição: Adiciona suporte ao status 'fraud_analysis'
--            para pedidos em análise antifraude da Appmax
-- =====================================================

-- 1. Verificar se existem vendas com status que precisam ser atualizadas
SELECT 
    id,
    appmax_order_id,
    customer_name,
    customer_email,
    status,
    created_at
FROM public.sales
WHERE status IN ('pending', 'processing')
AND payment_method = 'credit_card'
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 2. Comentário informativo sobre o status
COMMENT ON COLUMN public.sales.status IS 
'Status do pedido: 
- pending: Aguardando pagamento (PIX/Boleto)
- fraud_analysis: Em análise antifraude (Cartão)
- approved: Aprovado
- paid: Pago
- refused: Recusado
- cancelled: Cancelado
- expired: Expirado
- refunded: Estornado
- chargeback: Chargeback
- completed: Completo';

-- 3. Criar índice para consultas de análise antifraude
CREATE INDEX IF NOT EXISTS idx_sales_fraud_analysis 
ON public.sales(status, payment_method, created_at) 
WHERE status = 'fraud_analysis';

-- 4. Criar view para monitorar pedidos em análise
CREATE OR REPLACE VIEW public.sales_fraud_analysis AS
SELECT 
    s.id,
    s.appmax_order_id,
    s.customer_name,
    s.customer_email,
    s.customer_phone,
    s.total_amount,
    s.payment_method,
    s.status,
    s.created_at,
    -- Tempo em análise
    EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 as hours_in_analysis,
    -- Classificação de urgência
    CASE 
        WHEN EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 > 24 THEN 'critical'
        WHEN EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 > 12 THEN 'warning'
        ELSE 'normal'
    END as urgency_level
FROM public.sales s
WHERE s.status = 'fraud_analysis'
ORDER BY s.created_at DESC;

-- 5. Verificar resultado
SELECT 
    status,
    COUNT(*) as total,
    SUM(total_amount) as valor_total
FROM public.sales
GROUP BY status
ORDER BY total DESC;

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================
-- 1. Execute o script completo no Supabase SQL Editor
-- 2. O webhook já está configurado para usar 'fraud_analysis'
-- 3. O dashboard será atualizado para mostrar esses pedidos
-- 4. View 'sales_fraud_analysis' pode ser usada para monitorar
-- =====================================================
