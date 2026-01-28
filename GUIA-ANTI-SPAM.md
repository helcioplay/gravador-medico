# 📧 Guia Anti-SPAM - Gravador Médico

## Por que o email foi para SPAM?

Existem várias razões pelas quais emails podem ir para spam:

### 1. **Autenticação de Domínio (CRÍTICO)**

O Resend precisa de autenticação SPF, DKIM e DMARC no domínio `gravadormedico.com.br`.

#### Verificar no Resend:
1. Acesse https://resend.com/domains
2. Verifique se `gravadormedico.com.br` está verificado
3. Adicione os registros DNS necessários:

```dns
# SPF Record (TXT)
v=spf1 include:_spf.resend.com ~all

# DKIM Record (TXT) - O Resend fornece este valor
resend._domainkey.gravadormedico.com.br

# DMARC Record (TXT)
_dmarc.gravadormedico.com.br
v=DMARC1; p=none; rua=mailto:dmarc@gravadormedico.com.br
```

### 2. **From Address**
Atualmente usando: `noreply@gravadormedico.com.br`

✅ Bom: Usar domínio próprio
❌ Evitar: `noreply@` pode ser marcado como spam

**Sugestão:** Trocar para `contato@gravadormedico.com.br` ou `suporte@gravadormedico.com.br`

### 3. **Conteúdo do Email**
- ❌ Evitar: Excesso de emojis no assunto
- ❌ Evitar: Palavras como "GRÁTIS", "URGENTE", "GANHE"
- ✅ Incluir: Texto simples junto com HTML
- ✅ Incluir: Link de descadastramento (unsubscribe)

### 4. **Reputação do Remetente**
- Enviar emails gradualmente (warm-up)
- Manter baixa taxa de bounces
- Evitar listas compradas

---

## Ações Recomendadas

### Imediato:
1. [ ] Verificar domínio no Resend Dashboard
2. [ ] Adicionar registros SPF/DKIM/DMARC no DNS
3. [ ] Trocar remetente para `suporte@gravadormedico.com.br`

### Curto prazo:
4. [ ] Adicionar versão texto puro do email
5. [ ] Adicionar link de unsubscribe
6. [ ] Remover emoji do assunto se persistir problema

### Médio prazo:
7. [ ] Implementar webhook do Resend para tracking
8. [ ] Monitorar taxa de bounces/complaints

---

## Links Úteis

- [Resend Domains](https://resend.com/domains)
- [SPF Record Checker](https://mxtoolbox.com/spf.aspx)
- [DKIM Validator](https://mxtoolbox.com/dkim.aspx)
- [DMARC Analyzer](https://mxtoolbox.com/DMARC.aspx)

---

## Configuração DNS Exemplo

No seu provedor de DNS (Cloudflare, Route53, etc):

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| TXT | @ | v=spf1 include:_spf.resend.com ~all | 3600 |
| TXT | resend._domainkey | (valor do Resend) | 3600 |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:dmarc@gravadormedico.com.br | 3600 |
