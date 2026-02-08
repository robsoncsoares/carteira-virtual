# 🔧 Como Configurar Login com Google no Firebase

## ⚠️ Erro Comum: "Erro ao fazer login com Google"

Esse erro geralmente acontece porque o **Google Sign-In não está habilitado** no Firebase ou o **domínio não está autorizado**.

---

## 📋 Passo a Passo para Corrigir

### **1. Habilitar Google Sign-In no Firebase Console**

1. Acesse: https://console.firebase.google.com/project/carteira-virtual-d8568/authentication/providers

2. Na aba **"Sign-in method"**, encontre **"Google"**

3. Clique em **"Google"**

4. Ative o switch **"Enable"** (Habilitar)

5. Configure:
   ```
   Project support email: seu-email@gmail.com
   ```

6. Clique em **"Save"** (Salvar)

---

### **2. Adicionar Domínios Autorizados**

1. No Firebase Console, vá em **Authentication** → **Settings**

2. Role até **"Authorized domains"** (Domínios autorizados)

3. Clique em **"Add domain"** (Adicionar domínio)

4. Adicione os seguintes domínios:
   ```
   localhost
   carteira-virtual-d8568.web.app
   carteira-virtual-d8568.firebaseapp.com
   ```

5. Se tiver domínio customizado, adicione também:
   ```
   seudominio.com.br
   www.seudominio.com.br
   ```

---

### **3. Verificar Configuração do Firebase**

Certifique-se que o arquivo `.env` está configurado corretamente:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=carteira-virtual-d8568.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carteira-virtual-d8568
VITE_FIREBASE_STORAGE_BUCKET=carteira-virtual-d8568.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

**⚠️ IMPORTANTE:** O `authDomain` deve ser exatamente:
```
carteira-virtual-d8568.firebaseapp.com
```

---

### **4. Rebuild e Testar**

Depois de configurar no Firebase:

```bash
# Parar o servidor (Ctrl+C)

# Rebuild
npm run build

# Redeploy
firebase deploy

# Ou rodar localmente
npm run dev
```

---

## 🧪 Testando Localmente

1. Abra o console do navegador (F12)
2. Vá para a aba **Console**
3. Tente fazer login com Google
4. Observe as mensagens de erro no console

Os logs agora mostram:
- Código do erro específico
- Mensagem detalhada
- Tipo do problema

---

## 🔍 Erros Comuns e Soluções

### **Erro: "auth/popup-blocked"**
**Causa:** Navegador bloqueou o popup
**Solução:** Permita popups para o site

### **Erro: "auth/popup-closed-by-user"**
**Causa:** Você fechou o popup antes de completar
**Solução:** Tente novamente e selecione uma conta

### **Erro: "auth/unauthorized-domain"**
**Causa:** Domínio não autorizado no Firebase
**Solução:** Adicione o domínio na lista de autorizados

### **Erro: "auth/operation-not-allowed"**
**Causa:** Google Sign-In não está habilitado
**Solução:** Habilite no Firebase Console (Passo 1)

### **Erro: "auth/configuration-not-found"**
**Causa:** API Key inválida ou projeto mal configurado
**Solução:** Verifique as credenciais no `.env`

---

## 📸 Screenshots dos Passos

### Passo 1: Habilitar Google
```
Firebase Console → Authentication → Sign-in method → Google → Enable
```

### Passo 2: Domínios Autorizados
```
Firebase Console → Authentication → Settings → Authorized domains
```

---

## ✅ Checklist

Antes de testar, confirme:

- [ ] Google Sign-In está **habilitado** no Firebase
- [ ] Email de suporte está configurado
- [ ] Domínio `localhost` está na lista de autorizados
- [ ] Domínio `.web.app` está na lista de autorizados
- [ ] Arquivo `.env` está correto
- [ ] Fez rebuild depois de alterar `.env`

---

## 🆘 Ainda Não Funciona?

Execute este comando e me mostre o resultado:

```bash
# Verificar se .env está sendo lido
npm run dev
# Depois abra o console do navegador e cole:
console.log({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
})
```

Isso mostrará se as variáveis estão sendo lidas corretamente.
