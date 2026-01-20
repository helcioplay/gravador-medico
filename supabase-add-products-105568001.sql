-- Adicionar produtos ao pedido #105568001
-- Execute este SQL no Supabase SQL Editor

-- Primeiro, pegar o ID interno da venda
DO $$
DECLARE
  sale_uuid UUID;
BEGIN
  -- Busca o UUID da venda pelo ID da Appmax
  SELECT id INTO sale_uuid FROM public.sales WHERE appmax_order_id = '105568001';
  
  -- Insere o produto principal
  INSERT INTO public.sales_items (sale_id, product_id, product_name, product_type, price, quantity)
  VALUES (
    sale_uuid,
    '32991339',
    'Gravador Médico - Acesso Vitalício',
    'main',
    1.00,
    1
  )
  ON CONFLICT (sale_id, product_id) DO NOTHING;
  
  RAISE NOTICE 'Produto adicionado ao pedido #105568001';
END $$;

-- Verificar se foi adicionado
SELECT 
  si.product_name,
  si.product_type,
  si.price,
  si.quantity,
  s.appmax_order_id
FROM public.sales_items si
JOIN public.sales s ON s.id = si.sale_id
WHERE s.appmax_order_id = '105568001';
