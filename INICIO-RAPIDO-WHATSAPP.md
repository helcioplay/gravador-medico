# ⚡ INÍCIO RÁPIDO - WhatsApp Inbox

## ✅ Credenciais Configuradas

Todas as variáveis de ambiente já foram configuradas nos arquivos:
- ✅ `.env.local` (desenvolvimento)
- ✅ `.env.example` (template)

### 🔐 Credenciais Ativas:

**Supabase:**
- URL: https://egsmraszqnmosmtjuzhx.supabase.co ✅
- Anon Key: Configurado ✅
- Service Role Key: Configurado ✅
- JWT Secret: Configurado ✅

**Appmax:**
- API URL: https://admin.appmax.com.br/api/v3 ✅
- API Token: B6C99C65-4FAE30A5-BB3DFD79-CCEDE0B7 ✅
- Domínio: gravadormedico1768482029857.carrinho.app ✅

**Evolution API:**
- URL: https://evolution-api-production-eb21.up.railway.app ✅
- API Key: Beagle3005 ✅
- Instance: whatsapp-principal ✅

---

## 🚀 PASSOS PARA ATIVAR O WHATSAPP INBOX

### 1️⃣ Executar SQL no Supabase (5 minutos)

1. Acesse: https://app.supabase.com
2. Abra o projeto: `egsmraszqnmosmtjuzhx`
3. Vá em **SQL Editor** (ícone de </> na lateral)
4. Clique em **New Query**
5. Cole o conteúdo completo do arquivo:
   ```
   database/10-whatsapp-inbox.sql
   ```
6. Clique em **Run** (ou Ctrl+Enter)
7. ✅ Deve aparecer: "Success. No rows returned"

**Validar:**
```sql
-- Cole isso em uma nova query para validar
SELECT 
  'whatsapp_contacts' as tabela, 
  COUNT(*) as total 
FROM whatsapp_contacts
UNION ALL
SELECT 
  'whatsapp_messages' as tabela, 
  COUNT(*) as total 
FROM whatsapp_messages;
```

---

### 2️⃣ Habilitar Realtime no Supabase (1 minuto)

1. Ainda no Supabase, vá em **Database** > **Replication**
2. Procure a tabela `whatsapp_messages`
3. Clique no toggle para **Enable**
4. ✅ Status deve ficar verde

---

### 3️⃣ Configurar Webhook na Evolution API (3 minutos)

**Opção A: Via Painel Web (Recomendado)**
1. Acesse: https://evolution-api-production-eb21.up.railway.app
2. Login com API Key: `Beagle3005`
3. Vá em **Instância**: `whatsapp-principal`
4. Clique em **Webhooks**
5. Configure:
   - **URL**: `https://www.gravadormedico.com.br/api/webhooks/whatsapp`
   - **Eventos**: ✅ `messages.upsert`
   - **Método**: `POST`
6. Salvar

**Opção B: Via API (cURL)**
```bash
curl -X POST https://evolution-api-production-eb21.up.railway.app/webhook/set/whatsapp-principal \
  -H "Content-Type: application/json" \
  -H "apikey: Beagle3005" \
  -d '{
    "url": "https://www.gravadormedico.com.br/api/webhooks/whatsapp",
    "webhook_by_events": true,
    "events": ["MESSAGES_UPSERT"]
  }'
```

**⚠️ Para testar localmente (ngrok):**
```bash
# 1. Instalar ngrok
brew install ngrok

# 2. Expor porta 3000
ngrok http 3000

# 3. Copiar URL (ex: https://abc123.ngrok.io)

# 4. Configurar webhook temporário:
# URL: https://abc123.ngrok.io/api/webhooks/whatsapp
```

---

### 4️⃣ Sincronizar Histórico de Conversas (2 minutos)

**Opção A: Via Script**
```bash
npm run sync:whatsapp
```

**Opção B: Via API (Thunder Client / Postman)**
```bash
POST http://localhost:3000/api/whatsapp/sync
Content-Type: application/json

{
  "action": "sync-all",
  "messagesLimit": 100
}
```

**Resultado esperado:**
```json
{
  "success": true,
  "totalChats": 15,
  "totalMessages": 1234
}
```

---

### 5️⃣ Acessar Dashboard (Imediato!)

```
http://localhost:3000/dashboard/whatsapp
```

**O que você deve ver:**
- ✅ Lista de conversas à esquerda
- ✅ Fotos de perfil (se disponíveis)
- ✅ Preview da última mensagem
- ✅ Contador de não lidas
- ✅ Campo de busca

**Clicar em uma conversa:**
- ✅ Histórico de mensagens aparece
- ✅ Balões verdes (suas mensagens)
- ✅ Balões brancos (mensagens do cliente)
- ✅ Horários formatados

---

## 🧪 TESTAR REALTIME

### Método 1: WhatsApp Real
1. Peça para alguém te enviar uma mensagem no WhatsApp
2. A mensagem deve aparecer **automaticamente** no dashboard
3. Sem precisar atualizar a página!

### Método 2: Simular via cURL
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "instance": "whatsapp-principal",
    "data": {
      "key": {
        "remoteJid": "5521999999999@s.whatsapp.net",
        "fromMe": false,
        "id": "teste-'$(date +%s)'"
      },
      "message": {
        "conversation": "Olá! Esta é uma mensagem de teste!"
      },
      "messageType": "conversation",
      "messageTimestamp": '$(date +%s)',
      "pushName": "Cliente Teste"
    }
  }'
```

---

## 📊 COMANDOS ÚTEIS

### Verificar instalação
```bash
# Ver logs do servidor
npm run dev

# Testar webhook (health check)
curl http://localhost:3000/api/webhooks/whatsapp

# Deve retornar:
# {"status":"ok","webhook":"whatsapp-evolution-api-v2","timestamp":"..."}
```

### Consultar banco via SQL
```sql
-- Ver últimas mensagens
SELECT 
  content, 
  from_me, 
  timestamp 
FROM whatsapp_messages 
ORDER BY timestamp DESC 
LIMIT 10;

-- Ver conversas com mensagens não lidas
SELECT 
  remote_jid, 
  name, 
  unread_count 
FROM whatsapp_contacts 
WHERE unread_count > 0;

-- Estatísticas gerais
SELECT 
  (SELECT COUNT(*) FROM whatsapp_contacts) as contatos,
  (SELECT COUNT(*) FROM whatsapp_messages) as mensagens,
  (SELECT SUM(unread_count) FROM whatsapp_contacts) as nao_lidas;
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] SQL executado no Supabase
- [ ] Realtime habilitado
- [ ] Webhook configurado na Evolution API
- [ ] Histórico sincronizado
- [ ] Dashboard acessível em /dashboard/whatsapp
- [ ] Teste de mensagem realizado
- [ ] Mensagens aparecem em tempo real

---

## 🐛 PROBLEMAS COMUNS

### ❌ "Nenhuma conversa encontrada"
**Solução:** Execute `npm run sync:whatsapp` novamente

### ❌ "Erro ao conectar com Evolution API"
**Solução:** Verifique se a URL está correta e a API está online
```bash
curl -H "apikey: Beagle3005" \
  https://evolution-api-production-eb21.up.railway.app/instance/connectionState/whatsapp-principal
```

### ❌ Mensagens não aparecem em tempo real
**Solução:** Habilite Replication no Supabase (Database > Replication > whatsapp_messages)

### ❌ Webhook não está recebendo
**Solução:** 
1. Verifique os logs do Next.js
2. Use ngrok para testes locais
3. Confirme que o webhook está ativo na Evolution API

---

## 📚 PRÓXIMOS PASSOS

### Adicionar ao Menu do Dashboard
```tsx
// Em seu arquivo de menu/sidebar
<Link href="/dashboard/whatsapp">
  <MessageSquare className="w-5 h-5" />
  <span>WhatsApp Inbox</span>
  {unreadCount > 0 && (
    <Badge variant="success">{unreadCount}</Badge>
  )}
</Link>
```

### Adicionar Card de Stats na Home
```tsx
// Em app/dashboard/page.tsx
import WhatsAppStatsCard from '@/components/whatsapp/WhatsAppStatsCard'

<div className="grid grid-cols-3 gap-6">
  <WhatsAppStatsCard />
  {/* outros cards */}
</div>
```

---

## 🎉 PRONTO!

Seu **WhatsApp Inbox** está funcionando! 

**Tempo total de setup:** ~15 minutos

**Próximas features:**
- Envio de mensagens (em desenvolvimento)
- Integração com IA
- Respostas automáticas
- Analytics avançado

---

📖 **Documentação completa:** `docs/whatsapp-inbox-setup.md`  
🛠️ **Comandos úteis:** `WHATSAPP-COMANDOS.md`  
🏗️ **Arquitetura:** `WHATSAPP-ARQUITETURA.md`
