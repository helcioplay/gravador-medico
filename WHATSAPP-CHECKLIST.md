# ✅ Checklist de Validação - WhatsApp Inbox

Use este checklist para garantir que tudo está funcionando corretamente.

---

## 📋 Pré-requisitos

- [ ] Supabase configurado e funcionando
- [ ] Evolution API v2 instalada e rodando
- [ ] Instância do WhatsApp conectada na Evolution API
- [ ] Next.js 15 rodando localmente

---

## 🗄️ Banco de Dados

### Setup Inicial
- [ ] SQL executado no Supabase (`database/10-whatsapp-inbox.sql`)
- [ ] Tabela `whatsapp_contacts` criada
- [ ] Tabela `whatsapp_messages` criada
- [ ] View `whatsapp_conversations` criada
- [ ] Triggers criados corretamente

### Validação SQL
Execute no SQL Editor do Supabase:

```sql
-- ✅ Verificar tabelas
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'whatsapp%';

-- Resultado esperado: whatsapp_contacts, whatsapp_messages

-- ✅ Verificar triggers
SELECT tgname FROM pg_trigger 
WHERE tgname LIKE '%whatsapp%';

-- ✅ Verificar view
SELECT * FROM whatsapp_conversations LIMIT 1;
```

---

## ⚙️ Configuração

### Variáveis de Ambiente
- [ ] `EVOLUTION_API_URL` configurado
- [ ] `EVOLUTION_API_KEY` configurado
- [ ] `EVOLUTION_INSTANCE_NAME` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado

### Teste de Conexão
```bash
# ✅ Testar Evolution API
curl -H "apikey: SUA_API_KEY" \
  https://sua-evolution-api.com/instance/connectionState/INSTANCIA

# Resultado esperado: { "state": "open" }
```

---

## 🌐 Webhook

### Configuração na Evolution API
- [ ] URL configurada: `https://seu-dominio.com/api/webhooks/whatsapp`
- [ ] Evento `messages.upsert` ativado
- [ ] Método `POST` selecionado

### Teste Local (ngrok)
```bash
# ✅ Expor localhost
ngrok http 3000

# ✅ Configurar URL temporária na Evolution API
# https://abc123.ngrok.io/api/webhooks/whatsapp

# ✅ Enviar mensagem de teste pelo WhatsApp
# ✅ Verificar logs no terminal Next.js
```

### Validação
- [ ] Mensagem de teste enviada pelo WhatsApp
- [ ] Log `📥 Webhook recebido:` apareceu no terminal
- [ ] Log `✅ Mensagem salva:` apareceu no terminal
- [ ] Mensagem apareceu no banco de dados

```sql
-- ✅ Verificar última mensagem recebida
SELECT * FROM whatsapp_messages 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🔄 Sincronização

### Backfill Inicial
- [ ] Script executado: `npm run sync:whatsapp`
- [ ] Conversas importadas com sucesso
- [ ] Mensagens importadas com sucesso

### Validação
```sql
-- ✅ Contar conversas importadas
SELECT COUNT(*) FROM whatsapp_contacts;

-- ✅ Contar mensagens importadas
SELECT COUNT(*) FROM whatsapp_messages;

-- ✅ Ver estatísticas
SELECT 
  (SELECT COUNT(*) FROM whatsapp_contacts) as contatos,
  (SELECT COUNT(*) FROM whatsapp_messages) as mensagens,
  (SELECT SUM(unread_count) FROM whatsapp_contacts) as nao_lidas;
```

---

## 🎨 Frontend

### Página Carregando
- [ ] Dashboard acessível: `http://localhost:3000/dashboard/whatsapp`
- [ ] Lista de conversas visível
- [ ] Fotos de perfil aparecendo
- [ ] Preview da última mensagem aparece
- [ ] Timestamp formatado corretamente

### Seleção de Conversa
- [ ] Clicar em conversa abre o chat
- [ ] Mensagens aparecem em ordem cronológica
- [ ] Balões verdes para mensagens minhas
- [ ] Balões brancos para mensagens do cliente
- [ ] Horários formatados (HH:mm)

### Mídias
- [ ] Imagens aparecem corretamente
- [ ] Vídeos podem ser reproduzidos
- [ ] Áudios podem ser ouvidos
- [ ] Documentos têm link de download

### Realtime
- [ ] Enviar mensagem pelo WhatsApp
- [ ] Mensagem aparece no dashboard SEM atualizar a página
- [ ] Contador de não lidas atualiza automaticamente

---

## 🔔 Notificações

### Contador de Não Lidas
- [ ] Badge verde aparece quando há mensagens não lidas
- [ ] Número correto de mensagens não lidas
- [ ] Ao abrir conversa, contador zera

### Validação
```sql
-- ✅ Ver mensagens não lidas
SELECT remote_jid, unread_count 
FROM whatsapp_contacts 
WHERE unread_count > 0;
```

---

## 🧪 Testes de Integração

### Fluxo Completo 1: Recebimento
1. [ ] Cliente envia mensagem pelo WhatsApp
2. [ ] Evolution API recebe
3. [ ] Webhook é disparado
4. [ ] Mensagem salva no banco
5. [ ] Trigger atualiza contato
6. [ ] Realtime notifica frontend
7. [ ] Mensagem aparece no dashboard

### Fluxo Completo 2: Sincronização
1. [ ] Executar `npm run sync:whatsapp`
2. [ ] Script busca conversas da Evolution API
3. [ ] Contatos salvos no banco
4. [ ] Mensagens salvas no banco
5. [ ] Dashboard mostra histórico completo

### Fluxo Completo 3: Busca
1. [ ] Abrir dashboard
2. [ ] Digitar nome/número no campo de busca
3. [ ] Lista filtra em tempo real
4. [ ] Contato correto aparece

---

## 🤖 IA (Opcional)

Se implementou o exemplo de IA:

- [ ] `OPENAI_API_KEY` configurado
- [ ] Endpoint `/api/whatsapp/ai-response` funciona
- [ ] Retorna resposta baseada no contexto

### Teste
```bash
curl -X POST http://localhost:3000/api/whatsapp/ai-response \
  -H "Content-Type: application/json" \
  -d '{"remoteJid": "552199999999@s.whatsapp.net"}'
```

---

## 🚀 Performance

### Testes de Carga
- [ ] Dashboard carrega em menos de 2 segundos
- [ ] Lista de conversas renderiza suavemente (sem lag)
- [ ] Scroll do chat é fluido
- [ ] Busca responde instantaneamente

### Otimizações
- [ ] Índices criados no banco
- [ ] Queries usando LIMIT
- [ ] Realtime apenas para mensagens novas
- [ ] Imagens lazy-loaded (se aplicável)

---

## 🔒 Segurança

- [ ] Webhook valida origem (se implementado)
- [ ] Service Role Key NÃO exposto no frontend
- [ ] Rotas protegidas com autenticação (se aplicável)
- [ ] Variáveis sensíveis em `.env.local` (não commitadas)

---

## 📱 Responsividade

- [ ] Layout funciona em desktop
- [ ] Layout funciona em tablet
- [ ] Layout funciona em mobile
- [ ] Sidebar oculta automaticamente em mobile (se implementado)

---

## 📊 Monitoramento

### Logs do Supabase
- [ ] Database > Logs mostra atividade
- [ ] Sem erros críticos
- [ ] Triggers executando corretamente

### Logs do Next.js
- [ ] Terminal mostra webhooks recebidos
- [ ] Sem erros 500
- [ ] Sem warnings de TypeScript

---

## 🎯 Funcionalidades Bonus

### Componentes Extras
- [ ] `WhatsAppStatsCard` mostrando métricas
- [ ] `WhatsAppSyncButton` funcionando
- [ ] Card de stats atualiza a cada 30s

### API Extras
- [ ] `GET /api/whatsapp/sync` retorna status
- [ ] `POST /api/whatsapp/sync` com `sync-conversation` funciona

---

## 📚 Documentação

- [ ] `WHATSAPP-SETUP-RAPIDO.md` lido
- [ ] `docs/whatsapp-inbox-setup.md` consultado
- [ ] `WHATSAPP-COMANDOS.md` salvo para referência
- [ ] `WHATSAPP-INDEX.md` revisado

---

## ✨ Checklist Final

### MVP (Mínimo Viável)
- [ ] Receber mensagens via webhook ✅
- [ ] Salvar no banco ✅
- [ ] Visualizar no dashboard ✅
- [ ] Sincronizar histórico ✅

### Completo
- [ ] Realtime funcionando ✅
- [ ] Mídias exibindo ✅
- [ ] Busca funcionando ✅
- [ ] Stats atualizando ✅
- [ ] Documentação completa ✅

### Produção Ready
- [ ] Deploy realizado
- [ ] Webhook configurado em produção
- [ ] Variáveis de ambiente em produção configuradas
- [ ] SSL ativo (HTTPS)
- [ ] Testes em produção OK

---

## 🎉 Status Final

### ✅ TUDO OK
Se todos os checkboxes acima estão marcados, seu WhatsApp Inbox está **100% funcional e pronto para uso!**

### ⚠️ PROBLEMAS?
Veja a seção **Troubleshooting** em:
- `WHATSAPP-COMANDOS.md`
- `docs/whatsapp-inbox-setup.md`

---

**Data de validação:** ___/___/______  
**Validado por:** _________________  
**Status:** ⬜ Pendente | ⬜ Em andamento | ⬜ Completo
