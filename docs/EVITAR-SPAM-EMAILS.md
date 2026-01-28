# 📧 Guia para Evitar SPAM - Configuração de E-mails

## 🚨 Problema: E-mails indo para SPAM

Os e-mails estão sendo enviados com sucesso, mas alguns provedores (Gmail, Outlook, etc.) podem classificá-los como SPAM. Isso acontece porque faltam algumas configurações de autenticação no domínio.

---

## ✅ Soluções Necessárias

### 1. Configurar SPF, DKIM e DMARC no DNS do domínio

Acesse o painel DNS do seu domínio `gravadormedico.com.br` e adicione os seguintes registros:

#### 1.1 SPF Record (já deve existir do Resend)
```
Tipo: TXT
Host: @
Valor: v=spf1 include:_spf.resend.com ~all
```

#### 1.2 DKIM Record (obter no painel do Resend)
```
Tipo: TXT
Host: resend._domainkey
Valor: [Copiar do painel Resend > Domínios > gravadormedico.com.br]
```

#### 1.3 DMARC Record
```
Tipo: TXT
Host: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:dmarc@gravadormedico.com.br
```

---

### 2. Verificar Domínio no Resend

1. Acesse: https://resend.com/domains
2. Adicione o domínio: `gravadormedico.com.br`
3. Copie os registros DNS que o Resend fornece
4. Adicione todos no painel DNS do seu provedor
5. Clique em "Verify" no Resend

---

### 3. Boas Práticas já Implementadas no Template

✅ **Email transacional claro** - Assunto indica "Dados de Acesso"
✅ **From verificado** - `noreply@gravadormedico.com.br`
✅ **HTML bem formatado** - Tables para compatibilidade
✅ **Texto simples** - Não parece marketing/spam
✅ **Link de ação claro** - "Acessar o Sistema"
✅ **Footer com contato** - Indica que é email legítimo

---

### 4. Instruções para os Clientes (Enquanto Configura)

Adicionar na página de obrigado ou no checkout:

```
📧 Enviamos seus dados de acesso por e-mail!

Se não encontrar na caixa de entrada, verifique:
- Pasta de SPAM
- Pasta de Promoções (Gmail)
- Pasta "Outros" (Outlook)

Após encontrar, marque como "Não é SPAM" para receber nossos próximos e-mails.
```

---

## 🔧 Passo a Passo no Resend

1. **Login**: https://resend.com/login
2. **Domains**: Clique em "Domains" no menu lateral
3. **Add Domain**: Adicione `gravadormedico.com.br`
4. **Copy DNS Records**: Copie os 3 registros (SPF, DKIM, DMARC)
5. **Configure DNS**: Cole no painel do seu provedor de domínio
6. **Wait Propagation**: Aguarde até 48h para propagação
7. **Verify**: Clique em "Verify Domain" no Resend

---

## 📊 Monitoramento

Após configurar, monitore a entrega em:
- **Resend Dashboard**: https://resend.com/emails
- **Gestão de E-mails**: https://seusite.com/admin (menu Gestão > E-mails)

---

## 🎯 Resultado Esperado

Após a configuração completa:
- ✅ E-mails chegam na caixa de entrada principal
- ✅ Taxa de entrega > 95%
- ✅ Sem marcação de SPAM
- ✅ Domínio verificado e confiável

---

## 📞 Suporte

Se precisar de ajuda com DNS:
- Hostinger: https://support.hostinger.com/dns
- GoDaddy: https://br.godaddy.com/help/dns
- Cloudflare: https://developers.cloudflare.com/dns
