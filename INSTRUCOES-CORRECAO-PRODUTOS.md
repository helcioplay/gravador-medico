# 🔧 CORREÇÃO DE PRODUTOS - Instruções

## 🎯 Problema Identificado
O dashboard está mostrando 1 produto fake: **"Plano Enterprise - Gravador Médico"** de R$ 297,00

## ✅ Solução Implementada
Criei uma rota especial para **limpar produtos fake** e inserir **apenas os 4 produtos reais**.

---

## 📋 AÇÃO NECESSÁRIA (Escolha UMA opção):

### **Opção 1: Via Browser (Mais Fácil)** ⭐ RECOMENDADO

Aguarde 2-3 minutos para o Vercel terminar o deploy, depois:

**Abra uma nova aba e cole esta URL:**
```
https://gravadormedico.com.br/api/admin/products/fix-real
```

Você verá um JSON confirmando:
```json
{
  "success": true,
  "message": "✅ Produtos corrigidos! 4 produtos reais no sistema",
  "summary": {
    "total": 4,
    "created": X,
    "updated": Y
  }
}
```

Depois, volte para `/admin/products` e atualize a página (F5).

---

### **Opção 2: Via Dashboard (Botão)**

1. Vá para: `https://gravadormedico.com.br/admin/products`
2. Clique no botão **"Sincronizar com Vendas"** (canto superior direito)
3. Aguarde a confirmação
4. Atualize a página (F5)

---

### **Opção 3: Via SQL (Supabase)**

Se preferir fazer manualmente no Supabase:

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo: `scripts/sql/fix-products-real.sql`
4. Execute (Run)

---

## 📦 Resultado Esperado

Após executar qualquer opção acima, você verá **APENAS 4 produtos**:

1. ✅ **Método Gravador Médico** - R$ 36,00 (Destaque)
2. ✅ **Conteúdo Infinito Instagram** - R$ 29,90
3. ✅ **Implementação Assistida** - R$ 97,00
4. ✅ **Análise Inteligente** - R$ 39,90

O produto fake de R$ 297 será **removido**.

---

## 🚀 Status do Deploy

**Commit:** `9707256`  
**Status:** Deploy automático iniciando...  
**Aguardar:** ~2-3 minutos  
**Acompanhar:** https://vercel.com/helcioplay/gravador-medico

---

## 🔍 Como Verificar

Depois de executar:

1. Acesse: `https://gravadormedico.com.br/admin/products`
2. Pressione **F5** (atualizar)
3. Conte os produtos: deve ter **4** (não 1)
4. O produto de R$ 297 deve ter **sumido**
5. As métricas virão das vendas reais

---

## 📞 Se Não Funcionar

1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Tente em aba anônima
3. Verifique se está logado como admin
4. Me avise para debug

---

**🎉 Após isso, seu catálogo estará 100% correto!**
