# 🚀 Setup Rápido - WhatsApp Inbox

## ⚡ 3 Passos para Começar

### 1️⃣ Executar SQL no Supabase

Abra o **SQL Editor** no Supabase e execute:

```bash
database/10-whatsapp-inbox.sql
```

### 2️⃣ Configurar Variáveis de Ambiente

Adicione ao `.env.local`:

```bash
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-api-key
EVOLUTION_INSTANCE_NAME=nome-da-instancia
```

### 3️⃣ Configurar Webhook na Evolution API

**URL:**
```
https://seu-dominio.com/api/webhooks/whatsapp
```

**Evento:** `messages.upsert`

---

## 📥 Importar Histórico (Opcional)

```bash
# Opção 1: Script Node.js
node scripts/sync-whatsapp-history.js

# Opção 2: Via API (Postman/Thunder Client)
POST http://localhost:3000/api/whatsapp/sync
{
  "action": "sync-all",
  "messagesLimit": 100
}
```

---

## 🎯 Acessar Dashboard

```
http://localhost:3000/dashboard/whatsapp
```

---

## 📚 Documentação Completa

Veja: `docs/whatsapp-inbox-setup.md`

---

## ✅ Checklist

- [ ] SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Webhook configurado na Evolution API
- [ ] Histórico importado
- [ ] Dashboard funcionando
- [ ] Mensagens chegando em tempo real

---

## 🆘 Problemas?

1. **Mensagens não aparecem?** → Verifique o webhook
2. **Sync não funciona?** → Teste a API Key manualmente
3. **Realtime não atualiza?** → Habilite Replication no Supabase

---

Feito! 🎉
