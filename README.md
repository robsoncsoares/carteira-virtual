# 💰 Carteira Virtual - Gestão de Ativos

Sistema completo e responsivo para gestão de investimentos e ativos financeiros, desenvolvido com React e Firebase.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários (Email/Senha e Google)
- ✅ Dashboard com visão geral dos ativos
- ✅ Cadastro e gerenciamento de ativos (ações, fundos, criptomoedas, etc)
- ✅ Visualização de gráficos e estatísticas
- ✅ Cálculo automático de rentabilidade
- ✅ Histórico de transações
- ✅ Design responsivo para mobile e desktop

## 🛠️ Tecnologias

- **React** - Framework JavaScript
- **Vite** - Build tool
- **Firebase** - Backend (Auth, Firestore)
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **React Router** - Navegação

## 📋 Pré-requisitos

- Node.js 16+
- Conta no Firebase

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Email/Password e Google)
   - Crie um banco Firestore
   - Copie as credenciais do Firebase

4. Crie o arquivo `.env` na raiz do projeto:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   VITE_FIREBASE_PROJECT_ID=seu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

## 🚀 Como Executar

### Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Deploy no Firebase
```bash
npm run build
firebase deploy
```

## 📱 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── services/         # Serviços (Firebase, API)
├── contexts/         # Contextos React
├── hooks/            # Custom Hooks
├── utils/            # Funções utilitárias
└── styles/           # Estilos globais
```

## 📊 Estrutura de Dados

### Ativo
```javascript
{
  id: string,
  userId: string,
  nome: string,
  tipo: 'acao' | 'fundo' | 'cripto' | 'renda-fixa' | 'outro',
  quantidade: number,
  precoCompra: number,
  precoAtual: number,
  dataCompra: timestamp,
  createdAt: timestamp
}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT
