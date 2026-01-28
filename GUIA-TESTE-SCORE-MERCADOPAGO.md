# 🧪 Guia de Teste - Melhorias Score Mercado Pago

## ✅ Como Testar as Alterações

### 1. **Verificar Build Local**
```bash
npm run build
```
**Status:** ✅ Build passou com sucesso!

### 2. **Testar Checkout PIX**

#### Via Frontend:
1. Acesse o checkout do produto
2. Preencha os dados do cliente
3. Escolha PIX como forma de pagamento
4. Finalize a compra

#### Verificar nos Logs:
```bash
# No console do servidor Next.js, procure por:
🔵 Gerando PIX no Mercado Pago...
```

#### No Painel do Mercado Pago:
1. Acesse: https://www.mercadopago.com.br/payments
2. Encontre o pagamento recente
3. Clique em "Ver detalhes"
4. **Verifique se aparece:**
   - ✅ Informações do produto
   - ✅ IP do cliente
   - ✅ Categoria "learnings"

---

### 3. **Testar Checkout com Cartão de Crédito**

#### Dados de Teste Mercado Pago:
```
Cartão: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO (para aprovação)
CPF: Qualquer CPF válido
```

#### Via Frontend (Enterprise):
1. Acesse o checkout
2. Escolha "Cartão de Crédito"
3. Preencha com dados de teste acima
4. Finalize

#### Verificar nos Logs:
```bash
💳 [1/2] Tentando Mercado Pago...
📦 PAYLOAD ENVIADO PARA MERCADO PAGO: {...}
```

#### Confirmar no Payload:
Procure por:
```json
{
  "additional_info": {
    "items": [
      {
        "id": "metodo-gravador-medico-v1",
        "title": "Método Gravador Médico",
        "category_id": "learnings",
        ...
      }
    ],
    "ip_address": "xxx.xxx.xxx.xxx"
  }
}
```

---

### 4. **Validar IP do Cliente**

#### Teste Local (IP será 127.0.0.1):
```bash
curl -X POST http://localhost:3000/api/checkout/enterprise \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: 200.201.202.203" \
  -d '{...dados do checkout...}'
```

#### Em Produção (Vercel):
O IP real do cliente será capturado automaticamente via headers:
- `x-forwarded-for` (prioridade)
- `x-real-ip` (fallback)

---

### 5. **Validar Estrutura no Mercado Pago**

#### Via API (opcional):
```bash
curl -X GET https://api.mercadopago.com/v1/payments/{payment_id} \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Procure no response:
```json
{
  "additional_info": {
    "items": [...],
    "ip_address": "..."
  }
}
```

---

## 🔍 Checklist de Validação

- [ ] Build local passou sem erros
- [ ] Checkout PIX enviando `additional_info`
- [ ] Checkout Cartão enviando `additional_info`
- [ ] IP do cliente sendo capturado corretamente
- [ ] Dados visíveis no painel do Mercado Pago
- [ ] Sem erros nos logs do servidor
- [ ] Taxa de aprovação melhorou (após alguns dias de uso)

---

## 📊 Métricas para Acompanhar

### Antes vs Depois:
1. **Taxa de Aprovação Geral**
   - Antes: __%
   - Depois: __%

2. **Rejeições por Fraude**
   - Antes: __%
   - Depois: __%

3. **Score de Qualidade do Integrador**
   - Consultar no painel do Mercado Pago
   - Path: Configurações → Qualidade de integração

---

## 🐛 Troubleshooting

### Erro: "additional_info inválido"
**Solução:** Verifique se o `unit_price` está sendo enviado como número:
```javascript
unit_price: Number(amount) // ✅ Correto
unit_price: amount // ❌ Pode ser string
```

### IP sempre 127.0.0.1
**Causa:** Teste local ou headers não configurados
**Solução:** 
- Em produção, Vercel/Cloudflare adiciona automaticamente
- Em local, use ngrok ou teste diretamente em staging

### Produto não aparece no painel MP
**Causa:** Demora na sincronização
**Solução:** Aguarde alguns minutos e recarregue a página do pagamento

---

## 📞 Suporte

Em caso de dúvidas sobre a integração:
- Docs: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/developers/pt/support

---

**Última Atualização:** 28/01/2026
