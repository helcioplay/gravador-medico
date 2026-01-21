#!/bin/bash

# ================================================================
# Script de Teste - Endpoint findContacts (ÚNICO que funciona)
# ================================================================
# Após testes com curl, confirmado que:
# ✅ /instance/fetchInstances - FUNCIONA
# ✅ /chat/findContacts - FUNCIONA (usar este!)
# ❌ /chat/findPicture - 404
# ❌ /chat/fetchProfilePicture - 404
# ================================================================

EVOLUTION_API_URL="https://evolution-api-production-eb21.up.railway.app"
API_KEY="Beagle3005"
INSTANCE_NAME="whatsapp-principal"

# ================================================================
# CONFIGURAÇÃO: Coloque um número de teste real aqui
# Formato: 5511999999999@s.whatsapp.net
# ================================================================
REMOTE_JID="${1:-5511999999999@s.whatsapp.net}"

echo "════════════════════════════════════════════════════════════"
echo "🧪 TESTE: Endpoint /chat/findContacts"
echo "════════════════════════════════════════════════════════════"
echo "Instance: $INSTANCE_NAME"
echo "RemoteJid: $REMOTE_JID"
echo ""

# Montar URL com query parameter where[remoteJid]
URL="${EVOLUTION_API_URL}/chat/findContacts/${INSTANCE_NAME}?where[remoteJid]=${REMOTE_JID}"

echo "📡 URL Completa:"
echo "$URL"
echo ""
echo "────────────────────────────────────────────────────────────"
echo "📥 Resposta JSON:"
echo "────────────────────────────────────────────────────────────"

# Fazer request com timeout de 10 segundos
RESPONSE=$(curl -s -w "\n%{http_code}" --max-time 10 -X GET "$URL" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json")

# Separar corpo e status code
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

# Exibir resultado formatado
if command -v jq &> /dev/null; then
  echo "$HTTP_BODY" | jq '.'
else
  echo "$HTTP_BODY"
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo "📊 Status HTTP: $HTTP_CODE"
echo "────────────────────────────────────────────────────────────"

# Verificar resultado
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ SUCESSO! Endpoint funcionando"
  echo ""
  echo "📝 Campos de foto para verificar:"
  echo "   - profilePictureUrl"
  echo "   - profilePicUrl"
  echo "   - picture"
  echo "   - imgUrl"
  echo "   - image"
  
  # Tentar extrair URL da foto se tiver jq
  if command -v jq &> /dev/null; then
    PHOTO=$(echo "$HTTP_BODY" | jq -r '
      if type == "array" then
        .[0].profilePictureUrl // .[0].profilePicUrl // .[0].picture // .[0].imgUrl // .[0].image // "null"
      else
        .profilePictureUrl // .profilePicUrl // .picture // .imgUrl // .image // "null"
      end
    ')
    
    if [ "$PHOTO" != "null" ] && [ -n "$PHOTO" ]; then
      echo ""
      echo "🖼️  Foto encontrada:"
      echo "$PHOTO"
    else
      echo ""
      echo "⚠️  Contato encontrado mas SEM foto de perfil"
    fi
  fi
else
  echo "❌ ERRO! Status HTTP $HTTP_CODE"
  echo ""
  echo "💡 Possíveis causas:"
  echo "   - API Key inválida"
  echo "   - Instance não existe"
  echo "   - RemoteJid não encontrado"
  echo "   - Endpoint mudou de versão"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Teste concluído!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📖 Uso:"
echo "   ./test-findcontacts.sh                          # Usa número padrão"
echo "   ./test-findcontacts.sh 5511999999999@s.whatsapp.net"
echo ""
