# Guia de Configuração Firebase

## Passo a Passo Detalhado

### 1. Criar Projeto Firebase

**URL:** https://console.firebase.google.com

1. Clique em "Criar Projeto"
2. Insira o nome: "carteira-virtual" (ou outro nome de sua preferência)
3. Clique em "Continuar"
4. Desative Google Analytics se desejar (opcional)
5. Clique em "Criar Projeto"
6. Aguarde até 1-2 minutos

### 2. Registrar Aplicação Web

1. No Firebase Dashboard, clique em "<>"
2. Preencha o nome do app: "Carteira Virtual Web"
3. Marque a opção Firebase Hosting (opcional)
4. Clique em "Registrar app"
5. **Copie as credenciais** que aparecerem

Suas credenciais parecerium assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_xxxxxXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "carteira-virtual-xxxx.firebaseapp.com",
  projectId: "carteira-virtual-xxxx",
  storageBucket: "carteira-virtual-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxx"
};
```

### 3. Cola as Credenciais

1. Abra `js/config.js` neste projeto
2. Substitua o objeto `firebaseConfig` pelos seus dados reais
3. Salve o arquivo

### 4. Ativar Autenticação Email/Password

1. No Firebase Console, vá para "Authentication"
2. Clique na aba "Sign-in method"
3. Clique em "Email/Password"
4. Ative a opção "Email/Password"
5. Clique em "Salvar"

### 5. Criar Banco de Dados Firestore

1. No Firebase Console, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo teste"
4. Selecione uma localização (ex: us-central1)
5. Clique em "Criar"

### 6. Configurar Regras de Segurança do Firestore

1. No Firestore, vá para aba "Regras"
2. Cole as seguintes regras:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{user_id} {
      allow read, write: if request.auth.uid == user_id;
      
      match /{collection=**}/document=** {
        allow read, write: if request.auth.uid == user_id;
      }
    }
  }
}
```

3. Clique em "Publicar"

## Usar sem Firebase (Modo Offline)

Se não quiser usar Firebase agora, a aplicação ainda funcionará com:
- LocalStorage para armazenar dados localmente
- Preços simulados
- Funcionalidades básicas de gestão

**Limitações em modo offline:**
- Dados não sincronizam entre dispositivos
- Sem nuvem para backup
- Sem autenticação real (login simulado)

## Testar a Aplicação

1. Inicie o servidor: `npm start`
2. Aceda a `http://localhost:8000`
3. Crie uma conta
4. Adicione alguns ativos
5. Explore o dashboard

## Próximos Passos

### Integração com API de Preços

Para preços reais em vez de simulados, integre uma API:

**Alpha Vantage (gratuito)**
```javascript
const apiKey = 'YOUR_ALPHA_VANTAGE_KEY';
const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=PETR4&apikey=${apiKey}`;
```

**IEX Cloud**
```javascript
const token = 'YOUR_IEX_TOKEN';
const url = `https://cloud.iexapis.com/stable/stock/PETR4/quote?token=${token}`;
```

### Deploy em Produção

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Vercel:**
```bash
npm install -g vercel
vercel
```

**GitHub Pages:**
```bash
git push origin main
# Ativar GitHub Pages nas configurações do repositório
```

## Troubleshooting

### "Firebase não está definido"
- Verifique se as credenciais em `config.js` estão corretas
- Verifique a conexão com a internet

### "Acesso negado ao Firestore"
- Verifique as regras de segurança
- Certifique-se de que está autenticado

### "Ativos não são salvos"
- O modo offline está ativo (dados salvos em localStorage)
- Configure Firebase para salvar na nuvem

## Monitoramento

No Firebase Console, você pode:
- Ver estatísticas de uso em "Analytics"
- Monitorar erros em "Crash Reporting"
- Ver logs em "Logs"

## Suporte

- Documentação Firebase: https://firebase.google.com/docs
- Stack Overflow: [firebase] tag
- Comunidade: https://firebase.google.com/community

---

**Configuração concluída com sucesso! 🎉**
