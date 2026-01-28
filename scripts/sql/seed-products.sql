-- =====================================================
-- 🎯 INSERIR PRODUTOS REAIS NA TABELA PRODUCTS
-- =====================================================
-- Este script insere os 4 produtos reais do sistema:
-- 1. Gravador Médico (Produto Principal)
-- 2. Conteúdo Infinito Instagram (Order Bump)
-- 3. Implementação Assistida (Order Bump)
-- 4. Análise Inteligente (Order Bump)
-- =====================================================

-- Limpar produtos existentes (opcional - comentar se não quiser limpar)
-- DELETE FROM products;

-- Inserir produtos (usando ON CONFLICT para não duplicar)
INSERT INTO products (
  external_id,
  name,
  description,
  price,
  image_url,
  category,
  plan_type,
  is_active,
  is_featured,
  checkout_url,
  created_at,
  updated_at
) VALUES 
-- 1️⃣ PRODUTO PRINCIPAL
(
  '32991339',
  'Gravador Médico - Acesso Vitalício',
  'Acesso completo e vitalício ao Gravador Médico com todas as funcionalidades. Transcrição automática de consultas, prontuários inteligentes e muito mais.',
  36.00,
  'https://gravadormedico.com.br/images/produto-principal.png',
  'one_time',
  'lifetime',
  true,
  true,
  'https://gravadormedico1768482029857.carrinho.app/one-checkout/ocudf/32991339',
  now(),
  now()
),

-- 2️⃣ ORDER BUMP 1 - Conteúdo Infinito Instagram
(
  '32989468',
  'Conteúdo Infinito para Instagram',
  'Templates e ideias infinitas para seu Instagram médico. 100+ templates prontos, calendário de conteúdo e scripts para Reels.',
  29.90,
  'https://gravadormedico.com.br/images/conteudo-instagram.png',
  'bump',
  'one_time',
  true,
  false,
  null,
  now(),
  now()
),

-- 3️⃣ ORDER BUMP 2 - Implementação Assistida
(
  '32989503',
  'Implementação Assistida',
  'Suporte dedicado para configurar tudo para você. Configuração completa, suporte 1:1 e integração personalizada.',
  97.00,
  'https://gravadormedico.com.br/images/implementacao-assistida.png',
  'bump',
  'service',
  true,
  false,
  null,
  now(),
  now()
),

-- 4️⃣ ORDER BUMP 3 - Análise Inteligente
(
  '32989520',
  'Análise Inteligente de Consultas',
  'IA avançada para análise de consultas e insights. Análise por IA, relatórios automáticos e insights de pacientes.',
  39.90,
  'https://gravadormedico.com.br/images/analise-inteligente.png',
  'bump',
  'one_time',
  true,
  false,
  null,
  now(),
  now()
)
ON CONFLICT (external_id) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  plan_type = EXCLUDED.plan_type,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  checkout_url = EXCLUDED.checkout_url,
  updated_at = now();

-- =====================================================
-- ✅ VERIFICAR INSERÇÃO
-- =====================================================
SELECT 
  external_id,
  name,
  price,
  category,
  is_active,
  is_featured
FROM products
ORDER BY 
  CASE 
    WHEN is_featured THEN 1 
    ELSE 2 
  END,
  price DESC;
