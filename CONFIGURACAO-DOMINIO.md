# 🚀 Guia Completo: Configurar carteiravirtual.com.br

## PARTE 1: CONFIGURAR CLOUDFLARE (15 minutos)

### Passo 1: Criar Conta no Cloudflare
1. Acesse: https://dash.cloudflare.com/sign-up
2. Preencha:
   - Email
   - Senha
3. Confirme o email

### Passo 2: Adicionar Domínio
1. No painel Cloudflare, clique em **"Add a Site"** ou **"Adicionar Site"**
2. Digite: `carteiravirtual.com.br`
3. Clique em **"Add site"**

### Passo 3: Escolher Plano FREE
1. Selecione o plano **"Free - $0"**
2. Clique em **"Continue"**

### Passo 4: Cloudflare Vai Escanear Seus DNS
1. Aguarde o escaneamento (30 segundos)
2. Cloudflare mostrará os registros DNS existentes
3. Clique em **"Continue"**

### Passo 5: ANOTAR os Nameservers do Cloudflare
Cloudflare mostrará 2 nameservers, algo como:

```
ada.ns.cloudflare.com
reza.ns.cloudflare.com
```

**⚠️ IMPORTANTE: COPIE esses 2 nameservers!**

---

## PARTE 2: ATUALIZAR NAMESERVERS NO REGISTRO.BR (5 minutos)

### Passo 6: Acessar Registro.br
1. Vá em: https://registro.br
2. Faça login com sua conta
3. Clique em **"Meus Domínios"**
4. Selecione: **carteiravirtual.com.br**

### Passo 7: Alterar Nameservers
1. Clique em **"Alterar Servidores DNS"**
2. Selecione: **"Usar servidores DNS customizados"**
3. Cole os 2 nameservers do Cloudflare:
   ```
   Nameserver 1: ada.ns.cloudflare.com
   Nameserver 2: reza.ns.cloudflare.com
   ```
4. Clique em **"Salvar"** ou **"Aplicar"**

### Passo 8: Aguardar Ativação no Cloudflare
1. Volte ao painel do Cloudflare
2. Aguarde 5-30 minutos
3. Você receberá email quando ativar: **"Cloudflare is now protecting your site"**

---

## PARTE 3: CONFIGURAR DNS NO CLOUDFLARE (10 minutos)

### Passo 9: Acessar DNS no Cloudflare
1. No painel Cloudflare, clique no domínio
2. Vá em **"DNS"** → **"Records"**

### Passo 10: LIMPAR Registros Antigos
1. Delete TODOS os registros A, AAAA e CNAME existentes
2. Deixe apenas registros TXT e MX (se existirem)

### Passo 11: Adicionar Registros do Firebase

**Registro 1 - Para domínio raiz:**
```
Type: A
Name: @ (ou deixe vazio)
IPv4 address: 151.101.1.195
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

**Registro 2 - Para domínio raiz:**
```
Type: A
Name: @ (ou deixe vazio)
IPv4 address: 151.101.65.195
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

**Registro 3 - Para www:**
```
Type: A
Name: www
IPv4 address: 151.101.1.195
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

**Registro 4 - Para www:**
```
Type: A
Name: www
IPv4 address: 151.101.65.195
Proxy status: Proxied (nuvem laranja) ✅
TTL: Auto
```

**⚠️ IMPORTANTE:** Certifique-se que a **nuvem está LARANJA** (Proxied)

---

## PARTE 4: CONFIGURAR NO FIREBASE (10 minutos)

### Passo 12: Acessar Firebase Console
1. Vá em: https://console.firebase.google.com/project/carteira-virtual-d8568/hosting/sites
2. Clique em **"Add custom domain"** ou **"Adicionar domínio personalizado"**

### Passo 13: Adicionar Domínio Raiz
1. Digite: `carteiravirtual.com.br` (sem www)
2. Clique em **"Continue"**

### Passo 14: Pular Verificação (Cloudflare já gerencia)
1. Firebase pedirá verificação TXT
2. Como Cloudflare já gerencia o DNS, pode pular ou adicionar o TXT no Cloudflare
3. Clique em **"Continue"**

### Passo 15: Confirmar IPs
1. Firebase mostrará os IPs (151.101.1.195 e 151.101.65.195)
2. Confirme que são os mesmos que você colocou no Cloudflare
3. Clique em **"Continue"**

### Passo 16: Aguardar Provisionamento SSL
1. Firebase começará a provisionar o certificado SSL
2. Pode levar de 15 minutos a 24 horas
3. Status ficará: **"Pending"** → **"Connected"**

### Passo 17: Adicionar www (Opcional mas Recomendado)
1. Repita os passos 13-16 para: `www.carteiravirtual.com.br`
2. Firebase permite redirecionar www → raiz automaticamente

---

## PARTE 5: OTIMIZAÇÕES NO CLOUDFLARE (5 minutos)

### Passo 18: Ativar Otimizações
No painel Cloudflare, vá em:

**Speed → Optimization:**
- ✅ Auto Minify: HTML, CSS, JavaScript
- ✅ Brotli
- ✅ Rocket Loader (opcional)

**SSL/TLS:**
- Modo: **Full (strict)**

**Caching:**
- Cache Level: **Standard**
- Browser Cache TTL: **4 hours**

---

## ✅ CHECKLIST FINAL

Antes de testar, confirme:

- [ ] Nameservers alterados no Registro.br
- [ ] Cloudflare status: Active
- [ ] 4 registros A adicionados no Cloudflare (2 para @ e 2 para www)
- [ ] Nuvem LARANJA ativa (Proxied)
- [ ] Domínio adicionado no Firebase
- [ ] SSL status no Firebase: Connected

---

## 🧪 TESTAR

Após tudo configurado, teste:

```bash
# Verificar DNS
dig carteiravirtual.com.br +short

# Verificar www
dig www.carteiravirtual.com.br +short

# Testar no navegador
https://carteiravirtual.com.br
https://www.carteiravirtual.com.br
```

---

## ⏰ TEMPO DE PROPAGAÇÃO

- DNS Cloudflare: 5-30 minutos
- SSL Firebase: 15 minutos a 24 horas
- Teste após 1 hora para garantir

---

## 🆘 PROBLEMAS COMUNS

**1. "DNS_PROBE_FINISHED_NXDOMAIN"**
- Nameservers ainda não propagaram
- Aguarde mais 30 minutos

**2. "Certificate provisioning pending"**
- Normal, aguarde até 24h
- Verifique se IPs estão corretos

**3. "Too many redirects"**
- No Cloudflare, SSL/TLS deve estar em "Full (strict)"

**4. Site não carrega**
- Confirme que nuvem está LARANJA no Cloudflare
- Verifique se os 4 registros A estão corretos

---

## 📞 SUPORTE

Se tiver problemas, me avise mostrando:
1. Screenshot do DNS no Cloudflare
2. Status no Firebase Console
3. Mensagem de erro que aparece
