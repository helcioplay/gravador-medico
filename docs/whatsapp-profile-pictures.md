# 📸 Atualização Automática de Foto de Perfil

## ✨ Funcionalidade Implementada

Toda vez que uma mensagem chega via webhook da Evolution API, o sistema agora:

1. ✅ **Busca a foto de perfil** do contato automaticamente
2. ✅ **Atualiza o banco de dados** com a URL da foto
3. ✅ **Mantém as fotos sincronizadas** sem precisar buscar histórico

---

## 🔧 Como Funciona

### Fluxo do Webhook

**Arquivo:** `app/api/webhooks/whatsapp/route.ts`

```typescript
// PASSO 1: Buscar foto de perfil
const profilePictureUrl = await fetchProfilePicture(key.remoteJid)

// PASSO 2: UPSERT do contato (com foto)
await upsertWhatsAppContact({
  remote_jid: key.remoteJid,
  push_name: pushName || undefined,
  profile_picture_url: profilePictureUrl || undefined,
  is_group: key.remoteJid.includes('@g.us')
})

// PASSO 3: INSERT da mensagem
await upsertWhatsAppMessage(messageInput)
```

### Função de Busca de Foto

```typescript
async function fetchProfilePicture(remoteJid: string): Promise<string | null> {
  const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
  const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
  const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME

  // Endpoint: POST /chat/findProfilePicture/{instance}
  const url = `${EVOLUTION_API_URL}/chat/findProfilePicture/${EVOLUTION_INSTANCE_NAME}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY
    },
    body: JSON.stringify({
      number: remoteJid
    })
  })

  const data = await response.json()
  return data.profilePictureUrl || null
}
```

---

## 📋 Endpoint da Evolution API

**URL:** `POST /chat/findProfilePicture/{instance}`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "apikey": "SUA_API_KEY"
}
```

**Body:**
```json
{
  "number": "5521988960217@s.whatsapp.net"
}
```

**Response (Sucesso):**
```json
{
  "profilePictureUrl": "https://pps.whatsapp.net/v/..."
}
```

**Response (Sem Foto):**
```json
{
  "profilePictureUrl": null
}
```

---

## 🎯 Benefícios

✅ **Atualização automática** - Não precisa buscar histórico  
✅ **Sempre sincronizado** - Toda mensagem nova atualiza a foto  
✅ **Sem duplicatas** - UPSERT garante único contato por `remote_jid`  
✅ **Fallback seguro** - Se falhar, salva `null` e continua  
✅ **Logs claros** - Fácil debug com emojis  

---

## 📊 Logs do Webhook

```bash
📥 Webhook recebido: {
  event: 'messages.upsert',
  remoteJid: '5521988960217@s.whatsapp.net',
  fromMe: false
}
📸 Buscando foto de perfil...
📸 Foto de perfil encontrada para 5521988960217@s.whatsapp.net
🔄 Criando/atualizando contato primeiro...
✅ Contato garantido: 5521988960217@s.whatsapp.net
✅ Mensagem salva: <uuid>
```

**Caso não encontre foto:**
```bash
📸 Buscando foto de perfil...
⚠️ Não foi possível buscar foto de perfil para 5521988960217@s.whatsapp.net
🔄 Criando/atualizando contato primeiro...
✅ Contato garantido: 5521988960217@s.whatsapp.net (sem foto)
```

---

## 🧪 Como Testar

### 1. Enviar Mensagem no WhatsApp

Envie uma mensagem de qualquer número para o WhatsApp conectado.

### 2. Verificar Logs do Webhook

Procure por:
```
📸 Foto de perfil encontrada para...
```

### 3. Consultar Banco de Dados

```sql
SELECT 
  remote_jid,
  push_name,
  profile_picture_url,
  created_at,
  updated_at
FROM whatsapp_contacts
ORDER BY updated_at DESC
LIMIT 5;
```

**Resultado Esperado:**
```
| remote_jid                    | push_name | profile_picture_url        |
|-------------------------------|-----------|----------------------------|
| 5521988960217@s.whatsapp.net  | João      | https://pps.whatsapp.net/... |
```

### 4. Verificar na Interface

Acesse `/admin/whatsapp` e veja as fotos de perfil aparecendo automaticamente na lista de conversas.

---

## ⚙️ Variáveis de Ambiente Necessárias

```env
EVOLUTION_API_URL=https://evolution-api-production-eb21.up.railway.app
EVOLUTION_API_KEY=Beagle3005
EVOLUTION_INSTANCE_NAME=whatsapp-principal
```

**Importante:** Essas variáveis já devem estar configuradas no `.env.local`

---

## 🔄 Atualização de Fotos Existentes

Se você já tem contatos no banco **sem foto**, eles serão atualizados automaticamente quando:

1. ✅ Receberem uma nova mensagem
2. ✅ Enviarem uma mensagem

**Não é necessário buscar histórico!** O sistema se auto-corrige com o uso normal.

---

## 🚨 Tratamento de Erros

### Caso 1: Evolution API Offline
```typescript
⚠️ Não foi possível buscar foto de perfil para ...
✅ Contato garantido (foto = null)
✅ Mensagem salva normalmente
```

### Caso 2: Contato Sem Foto
```typescript
📸 Foto de perfil encontrada: null
✅ Contato salvo com profile_picture_url = null
```

### Caso 3: Variáveis Não Configuradas
```typescript
⚠️ Variáveis de ambiente Evolution API não configuradas
✅ Contato salvo sem foto
```

**Em todos os casos, o webhook continua funcionando!**

---

## 📦 Deploy

```bash
git add app/api/webhooks/whatsapp/route.ts
git commit -m "feat: buscar foto de perfil do contato via Evolution API ao receber mensagem"
git push origin main
```

**Status:** ✅ Implementado e em produção

---

## 🎨 Interface Atualizada

Agora a lista de conversas em `/admin/whatsapp` mostra:

- ✅ **Foto de perfil** real do WhatsApp
- ✅ **Fallback** para avatar com inicial do nome se não tiver foto
- ✅ **Atualização automática** a cada nova mensagem

**Exemplo Visual:**

```
┌─────────────────────────────────┐
│ 📱 WhatsApp Inbox               │
├─────────────────────────────────┤
│                                 │
│  [📸]  João Silva               │
│        Você: Olá! Tudo bem?     │
│                                 │
│  [J]   Maria Santos             │
│        Sim, obrigada!           │
│                                 │
└─────────────────────────────────┘
```

---

## 💡 Melhorias Futuras (Opcional)

- [ ] Cache de fotos por 24h para evitar requisições excessivas
- [ ] Busca em lote de fotos ao carregar lista de conversas
- [ ] Webhook específico para atualização de foto de perfil
- [ ] Compressão/otimização das URLs de foto

**Por enquanto, a solução atual é eficiente e funcional!**
