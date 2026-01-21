# ✅ CHECKLIST: Implementação Analytics Avançado

## 📋 Passo a Passo Completo

### 1. Executar SQLs no Supabase

Acesse: **Supabase Dashboard → SQL Editor**

- [ ] **1.1** Executar `supabase-analytics-advanced.sql`
  - Cria views de atribuição, funil, health e online
  - Cria índices de performance
  - Cria função helper de queries customizadas

- [ ] **1.2** (OPCIONAL) Executar `supabase-analytics-test-data.sql`
  - Popula com 30+ visitantes de teste
  - Simula tráfego de Google, Instagram, Facebook, Direct
  - Cria 5 visitantes online em tempo real

### 2. Verificar Criação das Views

```sql
-- No SQL Editor do Supabase:
SELECT * FROM marketing_attribution LIMIT 5;
SELECT * FROM analytics_health;
SELECT * FROM analytics_funnel;
SELECT * FROM analytics_visitors_online;
```

**Resultado esperado:**
- ✅ Todas as queries retornam sem erro
- ✅ Se executou test-data: vê registros populados
- ✅ Se não: vê estrutura vazia (normal)

---

### 3. Ativar Rastreamento no Site Público

**Arquivo:** `app/layout.tsx` (raiz da aplicação pública)

Adicione no topo:

```tsx
'use client'

import { useAnalytics } from '@/lib/useAnalytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ Ativa rastreamento automaticamente
  useAnalytics()
  
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

**⚠️ ATENÇÃO:**
- Só funciona em **Client Components** (`'use client'`)
- NÃO adicione no `/app/admin/layout.tsx` (já tem filtro interno)
- O hook detecta `/admin/*` e não rastreia automaticamente

---

### 4. Testar Rastreamento

- [ ] **4.1** Acessar site público (ex: `http://localhost:3000/`)
- [ ] **4.2** Abrir DevTools Console (F12)
- [ ] **4.3** Ver log: `✅ Analytics heartbeat enviado`
- [ ] **4.4** Aguardar 30 segundos
- [ ] **4.5** Ver outro heartbeat
- [ ] **4.6** Verificar no Supabase:

```sql
SELECT * FROM analytics_visits ORDER BY created_at DESC LIMIT 1;
```

Deve mostrar seu registro recém-criado.

---

### 5. Acessar Dashboard de Analytics

- [ ] **5.1** Fazer login no admin
- [ ] **5.2** Navegar para: `/admin/analytics`
- [ ] **5.3** Verificar seções:

**✅ Health Monitor (Topo):**
- Visitantes Únicos
- Taxa de Conversão
- Receita Total
- Ticket Médio (AOV)

**✅ Gráfico Principal:**
- Eixo duplo (Visitantes + Vendas)
- Dados dos últimos 30 dias

**✅ Visitantes Online (Lado Direito):**
- Contador em tempo real
- Breakdown Mobile/Desktop
- Pulse animado

**✅ Atribuição de Marketing:**
- Gráfico de barras horizontal
- Receita por canal

**✅ Funil de Conversão:**
- 4 etapas visuais
- Percentual de cada etapa

**✅ Tabela Detalhada:**
- Todas as métricas por canal
- Taxa de conversão
- AOV por fonte

---

### 6. Testar Visitantes Online

**Em duas abas diferentes:**

- [ ] **6.1** Aba 1: Site público (`/`) → Aguardar 30s
- [ ] **6.2** Aba 2: Dashboard (`/admin/analytics`)
- [ ] **6.3** Ver contador "Visitantes Online" = 1
- [ ] **6.4** Abrir mais abas do site
- [ ] **6.5** Ver contador subir para 2, 3...
- [ ] **6.6** Fechar abas
- [ ] **6.7** Aguardar 5 minutos
- [ ] **6.8** Contador volta a 0 (timeout)

---

### 7. Configurar UTMs (Marketing)

Para rastrear campanhas, adicione UTMs nas URLs:

**Exemplo: Post no Instagram**
```
https://seusite.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancamento-2026
```

**Exemplo: Google Ads**
```
https://seusite.com/pricing?utm_source=google&utm_medium=cpc&utm_campaign=black-friday
```

**Resultado:**
- Aparece na tabela "Detalhamento de Canais"
- Mostra qual campanha gera mais receita

---

### 8. Integração com Vendas (Atribuição)

**Como funciona:**

1. Usuário visita site → Gera `session_id`
2. Heartbeat salva UTMs (se houver)
3. Usuário compra → Salva `customer_email` em `checkout_attempts`
4. View SQL **cruza** visitante → venda (janela de 24h)

**Lógica (SQL):**

```sql
-- Se houve venda até 24h após a visita, atribui
cs.created_at BETWEEN ts.created_at AND (ts.created_at + INTERVAL '24 hours')
```

**Para atribuição perfeita:**
- Adicione `session_id` no formulário de checkout
- Passe para `checkout_attempts.session_id`
- Altere a View para usar `JOIN ON session_id`

---

## 🎯 Testes de Validação

### Teste 1: Analytics Básico

```sql
-- Deve retornar > 0
SELECT COUNT(*) FROM analytics_visits;
```

### Teste 2: Visitantes Online

```sql
-- Deve retornar os últimos 5 minutos
SELECT * FROM analytics_visitors_online;
```

### Teste 3: Health Metrics

```sql
-- Deve retornar KPIs
SELECT * FROM analytics_health;
```

### Teste 4: Atribuição com UTMs

1. Acesse: `http://localhost:3000/?utm_source=teste&utm_campaign=validacao`
2. Aguarde 30s
3. Execute:

```sql
SELECT * FROM marketing_attribution WHERE source = 'teste';
```

Deve aparecer o registro.

---

## 🐛 Problemas Comuns

### ❌ "Erro health: relation analytics_health does not exist"

**Causa:** SQL não foi executado.

**Solução:**
```bash
# Re-executar supabase-analytics-advanced.sql no SQL Editor
```

---

### ❌ Contador Online sempre em 0

**Debug:**

```sql
SELECT 
  session_id, 
  last_seen, 
  is_online,
  NOW() - last_seen as inativo_por
FROM analytics_visits
WHERE last_seen >= NOW() - INTERVAL '10 minutes'
ORDER BY last_seen DESC;
```

Se vazio: O hook não está ativo ou ninguém visitou.

---

### ❌ "Cannot find module useAnalytics"

**Causa:** Import errado.

**Solução:**
```tsx
// Correto:
import { useAnalytics } from '@/lib/useAnalytics'

// Errado:
import { useAnalytics } from '@/hooks/useAnalytics'
```

---

### ❌ Atribuição vazia mas há visitas

**Causa:** Não há vendas para correlacionar.

**Teste:** Criar uma venda manual:

```sql
INSERT INTO checkout_attempts (
  customer_email,
  total_amount,
  status,
  payment_method,
  created_at
) VALUES (
  'teste@exemplo.com',
  299.90,
  'paid',
  'pix',
  NOW() - INTERVAL '1 hour'
);
```

Depois:
```sql
SELECT * FROM marketing_attribution;
```

---

## 📊 Métricas de Sucesso

### Após 7 Dias de Produção:

- [ ] **100+ visitantes** registrados em `analytics_visits`
- [ ] **Atribuição populada** com pelo menos 3 fontes
- [ ] **Funil completo** com todas as 4 etapas
- [ ] **Taxa de conversão** calculada corretamente
- [ ] **Visitantes online** funcionando em tempo real

### Após 30 Dias:

- [ ] **Comparação de períodos** mostrando deltas (%)
- [ ] **Identificação do melhor canal** (Conv. > 2%)
- [ ] **Otimizações baseadas em dados** (funil, copy, UX)

---

## 🚀 Próximos Passos (Avançado)

### Adicionar Heatmaps
- Integrar com Hotjar ou Microsoft Clarity
- Rastrear cliques e scrolls

### Calcular CAC (Custo de Aquisição)
- Criar tabela `ad_spend` com gastos por canal
- Adicionar na View `marketing_attribution`

### Cohort Analysis (Retenção)
- Para SaaS: Rastrear usuários ao longo do tempo
- Ver quantos continuam ativos após 30/60/90 dias

### A/B Testing
- Criar variantes de páginas
- Rastrear conversão por variante

---

## ✅ Status Final

- [x] SQL Views criadas
- [x] Hook de rastreamento implementado
- [x] Página de Analytics finalizada
- [x] Visitantes online em tempo real
- [x] Atribuição de marketing configurada
- [x] Funil de conversão visual
- [x] Documentação completa

**Sistema pronto para produção! 🎉**

---

**Criado para:** Gravador Médico  
**Data:** 21/01/2026  
**Versão:** Analytics Advanced v1.0
