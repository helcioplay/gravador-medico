# 🔐 Guia de Acesso ao Dashboard Admin

## ✅ Checklist Completo

### 1️⃣ Schema SQL rodado? 
- [x] Sim, já executei no Supabase SQL Editor

### 2️⃣ Criar Usuário Admin no Supabase

#### Passo 1: Criar usuário na Auth
1. Acesse: https://supabase.com/dashboard/project/egsmraszqnmosmtjuzhx
2. Menu → **Authentication** → **Users**
3. Clique **"Add user"** → **"Create new user"**
4. Preencha:
   - Email: `seu@email.com`
   - Password: `suasenha123`
   - ✅ Auto Confirm User
5. Clique **"Create user"**
6. **COPIE o UUID** (User UID) que aparece

#### Passo 2: Tornar o usuário ADMIN
1. Vá em **SQL Editor**
2. Cole este código (SUBSTITUA os valores):

```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'COLE_SEU_UUID_AQUI',      -- UUID copiado da Auth
  'seu@email.com',            -- Mesmo email usado
  'Seu Nome Aqui',           -- Seu nome
  'admin'                    -- Role de admin
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

3. Clique **RUN**

#### Verificar se funcionou:
```sql
SELECT * FROM public.profiles WHERE role = 'admin';
```

---

## 🌐 URLs de Acesso

### Localhost (Desenvolvimento):
- **Site:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Admin:** http://localhost:3000/admin/dashboard

### Produção (Vercel/Domínio):
- **Site:** https://seu-dominio.com
- **Login:** https://seu-dominio.com/login
- **Admin:** https://seu-dominio.com/admin/dashboard

---

## 🐛 Troubleshooting

### Problema: "Ainda redireciona para gravadormedico.com"

**Causa:** Você está acessando de um domínio customizado na Vercel, mas o projeto não está configurado para aceitar esse domínio.

**Solução 1 - Acessar pelo domínio correto:**
- Se está no Vercel: `https://seu-projeto.vercel.app/login`
- Se está local: `http://localhost:3000/login`

**Solução 2 - Verificar variáveis de ambiente:**
No Vercel, verifique se as variáveis estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Solução 3 - Verificar se usuário foi criado:**
```sql
-- Deve retornar seu usuário com role='admin'
SELECT * FROM public.profiles WHERE email = 'seu@email.com';
```

---

## 🎯 Teste Rápido

1. Abra o navegador em **modo anônimo** (Cmd+Shift+N)
2. Acesse: `http://localhost:3000/login` (se local)
3. Digite email e senha que criou
4. Clique **Entrar**
5. Deve ir para: `/admin/dashboard`

Se ver tela **"Acesso Negado"** = usuário não é admin ainda
Se **funcionar** = Parabéns! Dashboard ativo! 🎉

---

## 📝 Status Atual

- [x] Schema SQL executado
- [ ] Usuário criado no Supabase Auth
- [ ] Perfil admin inserido na tabela profiles
- [ ] Testado login com sucesso

---

## 🆘 Precisa de Ajuda?

**Erro comum:** "Email ou senha incorretos"
- Verifique se o usuário foi criado no Auth do Supabase
- Verifique se marcou "Auto Confirm User"

**Erro comum:** "Acesso Negado"
- O usuário existe mas não é admin
- Rode o SQL do Passo 2 com o UUID correto

**Erro comum:** "Redireciona para outro domínio"
- Você está acessando de um domínio diferente do configurado
- Use o domínio correto (localhost ou vercel)
