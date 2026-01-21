#!/bin/bash

# ================================================================
# Script de Teste - WhatsApp Inbox
# ================================================================
# Testa se tudo está funcionando corretamente
# ================================================================

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          TESTE AUTOMÁTICO - WHATSAPP INBOX                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# ================================================================
# 1. Verificar variáveis de ambiente
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Verificando variáveis de ambiente..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env.local" ]; then
  echo -e "${RED}❌ Arquivo .env.local não encontrado!${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ .env.local encontrado${NC}"
  
  # Verificar variáveis específicas
  if grep -q "EVOLUTION_API_URL=" .env.local; then
    echo -e "${GREEN}✅ EVOLUTION_API_URL configurado${NC}"
  else
    echo -e "${RED}❌ EVOLUTION_API_URL não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "EVOLUTION_API_KEY=" .env.local; then
    echo -e "${GREEN}✅ EVOLUTION_API_KEY configurado${NC}"
  else
    echo -e "${RED}❌ EVOLUTION_API_KEY não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
    echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY configurado${NC}"
  else
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
  fi
fi

echo ""

# ================================================================
# 2. Verificar arquivos do projeto
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Verificando arquivos do projeto..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FILES=(
  "database/10-whatsapp-inbox.sql"
  "lib/types/whatsapp.ts"
  "lib/whatsapp-db.ts"
  "lib/whatsapp-sync.ts"
  "app/api/webhooks/whatsapp/route.ts"
  "app/api/whatsapp/sync/route.ts"
  "app/dashboard/whatsapp/page.tsx"
  "components/whatsapp/ChatLayout.tsx"
  "components/whatsapp/ContactList.tsx"
  "components/whatsapp/MessageBubble.tsx"
  "scripts/sync-whatsapp-history.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file${NC}"
  else
    echo -e "${RED}❌ $file (não encontrado)${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""

# ================================================================
# 3. Testar conexão com Evolution API
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Testando conexão com Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ler variáveis do .env.local
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ ! -z "$EVOLUTION_API_URL" ] && [ ! -z "$EVOLUTION_API_KEY" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "apikey: $EVOLUTION_API_KEY" \
    "$EVOLUTION_API_URL/instance/connectionState/$EVOLUTION_INSTANCE_NAME")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Evolution API está respondendo (HTTP $HTTP_CODE)${NC}"
  else
    echo -e "${RED}❌ Evolution API não está respondendo (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}   Verifique se a API está online e a API Key está correta${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${YELLOW}⚠️  Pulando teste (variáveis não configuradas)${NC}"
fi

echo ""

# ================================================================
# 4. Testar Webhook (se servidor estiver rodando)
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Testando webhook local..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if nc -z localhost 3000 2>/dev/null; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/webhooks/whatsapp)
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Webhook está respondendo (HTTP $HTTP_CODE)${NC}"
  else
    echo -e "${RED}❌ Webhook não está respondendo (HTTP $HTTP_CODE)${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${YELLOW}⚠️  Servidor não está rodando (execute 'npm run dev')${NC}"
fi

echo ""

# ================================================================
# 5. Verificar dependências
# ================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Verificando dependências..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
  DEPS=(
    "@supabase/supabase-js"
    "date-fns"
    "lucide-react"
  )
  
  for dep in "${DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
      echo -e "${GREEN}✅ $dep${NC}"
    else
      echo -e "${RED}❌ $dep (não encontrado)${NC}"
      ERRORS=$((ERRORS + 1))
    fi
  done
else
  echo -e "${RED}❌ package.json não encontrado${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ================================================================
# RESULTADO FINAL
# ================================================================
echo "╔══════════════════════════════════════════════════════════════╗"

if [ $ERRORS -eq 0 ]; then
  echo -e "║  ${GREEN}✅ TODOS OS TESTES PASSARAM!${NC}                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  echo -e "${GREEN}🎉 WhatsApp Inbox está pronto para uso!${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. Execute o SQL no Supabase: database/10-whatsapp-inbox.sql"
  echo "2. Configure o webhook na Evolution API"
  echo "3. Execute: npm run sync:whatsapp"
  echo "4. Acesse: http://localhost:3000/dashboard/whatsapp"
  exit 0
else
  echo -e "║  ${RED}❌ $ERRORS ERRO(S) ENCONTRADO(S)${NC}                             ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  echo -e "${RED}⚠️  Corrija os erros acima antes de continuar${NC}"
  echo ""
  echo "Documentação: docs/whatsapp-inbox-setup.md"
  exit 1
fi
