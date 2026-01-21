# 📱 WhatsApp Inbox - Evolution API v2

Módulo completo de **Inbox WhatsApp** integrado com **Evolution API v2** para seu SaaS Admin.

---

## 🎯 Funcionalidades

✅ **Recebimento automático** de mensagens via webhook  
✅ **Sincronização de histórico** (backfill de conversas antigas)  
✅ **Interface estilo WhatsApp Web** com lista de conversas e chat  
✅ **Suporte a mídias** (imagem, vídeo, áudio, documentos, stickers)  
✅ **Realtime** via Supabase (mensagens aparecem instantaneamente)  
✅ **Indicadores de leitura** (enviada, entregue, lida)  
✅ **Contador de mensagens não lidas**  
✅ **Busca de conversas**  

---

## 🛠 Stack Utilizada

- **Next.js 15** (App Router)
- **TypeScript**
- **Supabase** (PostgreSQL + Realtime)
- **Tailwind CSS**
- **Evolution API v2**

---

## 📦 Arquivos Criados

### 1. **Banco de Dados**
- `database/10-whatsapp-inbox.sql` - Schema completo (tabelas, triggers, views)

### 2. **Backend**
- `lib/types/whatsapp.ts` - Tipos TypeScript
- `lib/whatsapp-db.ts` - Funções CRUD (Supabase)
- `lib/whatsapp-sync.ts` - Service de sincronização com Evolution API
- `app/api/webhooks/whatsapp/route.ts` - Webhook handler (recebe mensagens)
- `app/api/whatsapp/sync/route.ts` - API para sincronização manual

### 3. **Frontend**
- `components/whatsapp/ChatLayout.tsx` - Container principal
- `components/whatsapp/ContactList.tsx` - Lista de conversas
- `components/whatsapp/MessageBubble.tsx` - Balão de mensagem
- `app/dashboard/whatsapp/page.tsx` - Página completa do inbox

### 4. **Scripts**
- `scripts/sync-whatsapp-history.js` - Script de backfill inicial

---

## 🚀 Setup Passo a Passo

### **1. Executar o SQL no Supabase**

```bash
# Copie o conteúdo de database/10-whatsapp-inbox.sql
# Cole no SQL Editor do Supabase e execute
```

Isso vai criar:
- ✅ Tabela `whatsapp_contacts`
- ✅ Tabela `whatsapp_messages`
- ✅ View `whatsapp_conversations`
- ✅ Triggers automáticos
- ✅ Índices para performance

---

### **2. Configurar Variáveis de Ambiente**

Adicione ao seu `.env.local`:

```bash
# Supabase (já deve existir)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Evolution API v2
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE_NAME=nome-da-instancia
```

**Como obter credenciais da Evolution API:**
1. Acesse o painel da sua Evolution API
2. Crie uma instância (ou use existente)
3. Copie a API Key e o nome da instância

---

### **3. Configurar Webhook na Evolution API**

Acesse o painel da Evolution API e configure:

**URL do Webhook:**
```
https://seu-dominio.com/api/webhooks/whatsapp
```

**Eventos:**
- ✅ `messages.upsert` (mensagens enviadas/recebidas)
- ✅ `messages.update` (status de mensagens)

**Método:** `POST`

---

### **4. Fazer Backfill do Histórico**

Importe as conversas antigas para o banco:

```bash
# Opção 1: Via script Node.js
node scripts/sync-whatsapp-history.js

# Opção 2: Via API Route (use Postman ou Thunder Client)
POST http://localhost:3000/api/whatsapp/sync
{
  "action": "sync-all",
  "messagesLimit": 100
}
```

Isso vai:
1. Buscar todas as conversas da Evolution API
2. Popular a tabela `whatsapp_contacts`
3. Buscar as últimas N mensagens de cada conversa
4. Popular a tabela `whatsapp_messages`

---

### **5. Acessar o Dashboard**

Abra no navegador:

```
http://localhost:3000/dashboard/whatsapp
```

Você verá:
- ✅ Lista de conversas à esquerda
- ✅ Chat completo à direita
- ✅ Mensagens antigas importadas
- ✅ Novas mensagens chegando em tempo real

---

## 📊 Estrutura do Banco de Dados

### Tabela `whatsapp_contacts`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `remote_jid` | TEXT | ID do contato (ex: 552199999999@s.whatsapp.net) |
| `name` | TEXT | Nome do contato |
| `push_name` | TEXT | Nome do WhatsApp |
| `profile_picture_url` | TEXT | URL da foto de perfil |
| `is_group` | BOOLEAN | Se é grupo ou não |
| `last_message_content` | TEXT | Preview da última mensagem |
| `last_message_timestamp` | TIMESTAMPTZ | Data da última mensagem |
| `last_message_from_me` | BOOLEAN | Se última mensagem foi enviada por mim |
| `unread_count` | INTEGER | Mensagens não lidas |

### Tabela `whatsapp_messages`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `message_id` | TEXT | ID da mensagem da Evolution API |
| `remote_jid` | TEXT | ID do contato (FK) |
| `content` | TEXT | Texto da mensagem |
| `message_type` | TEXT | text, image, video, audio, document, sticker |
| `media_url` | TEXT | URL da mídia (se houver) |
| `caption` | TEXT | Legenda da mídia |
| `from_me` | BOOLEAN | Se foi enviada por mim |
| `timestamp` | TIMESTAMPTZ | Data/hora da mensagem |
| `status` | TEXT | sent, delivered, read |
| `raw_payload` | JSONB | Payload completo da Evolution API |

---

## 🤖 Preparado para IA

As tabelas já estão prontas para serem lidas por uma IA:

```sql
-- Exemplo: Buscar últimas 50 mensagens de um cliente
SELECT 
  content,
  from_me,
  timestamp,
  message_type
FROM whatsapp_messages
WHERE remote_jid = '552199999999@s.whatsapp.net'
ORDER BY timestamp DESC
LIMIT 50;
```

Você pode criar uma API que:
1. Busca o histórico de mensagens de um contato
2. Envia para uma IA (GPT-4, Claude, etc)
3. Gera respostas inteligentes
4. Salva no banco

---

## 🔧 Funções Úteis

### Marcar conversa como lida

```typescript
import { markConversationAsRead } from '@/lib/whatsapp-db'

await markConversationAsRead('552199999999@s.whatsapp.net')
```

### Buscar mensagens de uma conversa

```typescript
import { getWhatsAppMessages } from '@/lib/whatsapp-db'

const messages = await getWhatsAppMessages('552199999999@s.whatsapp.net', 100)
```

### Estatísticas gerais

```typescript
import { getWhatsAppStats } from '@/lib/whatsapp-db'

const stats = await getWhatsAppStats()
// { totalContacts: 50, totalMessages: 1234, totalUnread: 12 }
```

---

## 🎨 Personalizações

### Adicionar envio de mensagens

O componente já tem o campo de input preparado, mas o envio não está implementado.

Para adicionar:

1. Crie uma API route:
```typescript
// app/api/whatsapp/send-message/route.ts
export async function POST(request: NextRequest) {
  const { remoteJid, message } = await request.json()
  
  // Chamar Evolution API para enviar
  const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY
    },
    body: JSON.stringify({
      number: remoteJid.replace('@s.whatsapp.net', ''),
      text: message
    })
  })
  
  return NextResponse.json(await response.json())
}
```

2. Adicione no componente:
```typescript
async function sendMessage(text: string) {
  await fetch('/api/whatsapp/send-message', {
    method: 'POST',
    body: JSON.stringify({ remoteJid: selectedRemoteJid, message: text })
  })
}
```

---

## 🐛 Troubleshooting

### Mensagens não aparecem?

1. Verifique se o webhook está configurado corretamente
2. Teste: `curl https://seu-dominio.com/api/webhooks/whatsapp`
3. Veja os logs do Supabase (Database > Logs)

### Backfill não funciona?

1. Verifique as credenciais da Evolution API
2. Teste manualmente: `curl -H "apikey: SUA_KEY" https://evolution-api.com/chat/findChats/INSTANCIA`
3. Confira se o Supabase Service Role Key está configurado

### Realtime não atualiza?

1. Certifique-se que o Realtime está ativado no Supabase
2. Vá em Database > Replication e habilite `whatsapp_messages`

---

## 📈 Próximas Melhorias

- [ ] Envio de mensagens
- [ ] Envio de mídias
- [ ] Respostas rápidas
- [ ] Grupos (já suportado no backend, falta UI)
- [ ] Integração com IA (GPT-4 para responder automaticamente)
- [ ] Webhook de status de leitura
- [ ] Notificações push
- [ ] Busca de mensagens

---

## 📞 Suporte

Feito com ❤️ por GitHub Copilot

Em caso de dúvidas, revise:
1. [Evolution API Docs](https://doc.evolution-api.com)
2. [Supabase Realtime](https://supabase.com/docs/guides/realtime)
3. Os comentários nos arquivos criados
