# 📈 Carteira Virtual - Gestão de Ativos da Bolsa de Valores

Uma plataforma web responsiva e moderna para gestão de portfólio de investimentos com integração Firebase.

## ✨ Funcionalidades

### Dashboard
- 📊 Visualização em tempo real do valor total do portfólio
- 📈 Gráficos de performance e composição
- 💰 Resumo de ganhos e perdas
- 📋 Listagem dos principais ativos

### Gestão de Ativos
- ➕ Adicionar novos ativos (ações, fundos, criptomoedas, renda fixa)
- ✏️ Editar informações de ativos
- 🗑️ Remover ativos do portfólio
- 🔍 Buscar e filtrar ativos

### Transações
- 📝 Registro completo de compras e vendas
- 🗓️ Filtrar por tipo e data
- 📊 Histórico detalhado de operações
- 💹 Análise de custos e retornos

### Análise
- 📉 Gráficos de volatilidade e risco
- 📊 Análise mensal de ganhos e perdas
- 📈 Estatísticas de desempenho (Sharp Ratio, ROI)
- 🎯 Indicadores de diversificação

### Perfil e Configurações
- 👤 Informações da conta
- 🌙 Modo escuro/claro
- 🔔 Configurações de notificações
- 🔐 Segurança e autenticação

## 🚀 Inicialização Rápida

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/carteira-virtual.git
cd carteira-virtual
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Firebase

#### a. Criar Projeto Firebase
1. Aceda ao [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar Projeto"
3. Preencha os detalhes do projeto
4. Aguarde a criação

#### b. Obter Credenciais
1. No Firebase Console, clique em "Web" para criar um app web
2. Copie as credenciais de configuração
3. Abra `js/config.js`
4. Cole as suas credenciais no objeto `firebaseConfig`

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxxxxxx",
    databaseURL: "https://seu-projeto.firebaseio.com"
};
```

#### c. Configurar Autenticação
1. No Firebase, vá para "Authentication"
2. Clique em "Get started"
3. Ative "Email/Password"

#### d. Criar Banco de Dados Firestore
1. No Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha modo de teste
4. Use o Local padrão

### 4. Executar Localmente
```bash
npm start
```

O servidor estará disponível em `http://localhost:8000`

## 📁 Estrutura do Projeto

```
carteira-virtual/
├── index.html                 # Página principal
├── package.json              # Dependências e scripts
├── css/
│   ├── styles.css            # Estilos principais
│   └── responsive.css        # Estilos responsivos
├── js/
│   ├── config.js             # Configuração Firebase
│   ├── auth.js               # Autenticação
│   ├── dashboard.js          # Dashboard e gráficos
│   ├── ativos.js             # Gestão de ativos
│   └── utils.js              # Funções utilitárias
├── assets/                   # Imagens e recursos
└── README.md                 # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Gráficos**: Chart.js
- **Backend**: Firebase (Auth, Firestore)
- **Responsivo**: Mobile-first design
- **Armazenamento**: LocalStorage + Firestore

## 📱 Responsividade

O site é totalmente responsivo com suporte para:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Grandes ecrãs (1440px+)

## 🔐 Segurança

- Autenticação com Firebase Authentication
- Validação de dados no cliente
- Proteção de rotas com verificação de login
- Armazenamento seguro no Firestore

## 📊 Dados de Exemplo

A aplicação vem com preços simulados de ativos:
- **Ações**: PETR4, VALE3, ITUB4, BBDC4, WEGE3
- **Criptomoedas**: BTC, ETH
- Os preços são atualizados automaticamente a cada 5 segundos

Para usar preços reais, integre uma API como:
- Alpha Vantage
- IEX Cloud
- Rapid API

## 🎨 Temas

### Modo Claro (Padrão)
Tema claro e profissional com cores azuis

### Modo Escuro
Ative em Perfil → Preferências → Modo Escuro

## 📈 Funcionalidades Avançadas

### Análise Técnica
- Gráficos de velas (candlestick)
- Médias móveis
- Indicadores técnicos

### Relatórios
- Exportar para CSV
- Gerar PDF
- Impressão otimizada

### Integrações
- Sincronização com Firebase em tempo real
- Sincronização automática a cada 30 segundos
- Fallback para localStorage

## 🐛 Problemas Conhecidos

- Preços de ativos são simulados (integrar com API real)
- Modo offline limitado
- Alguns gráficos requerem mais otimização em mobile

## 📝 Plano Futuro

- [ ] Integração com API de preços real
- [ ] Notificações Push
- [ ] Alertas de preço
- [ ] Social trading
- [ ] Carteiras compartilhadas
- [ ] App móvel nativa
- [ ] Análise avançada com IA
- [ ] Dashboard customizável

## 🤝 Contribuir

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no repositório GitHub ou contacte:
- 📧 Email: seu@email.com
- 💬 Discord: [Link do servidor]

## 🙏 Agradecimentos

Obrigado a:
- Firebase pela infraestrutura
- Chart.js pelos gráficos
- Comunidade de open source

---

**Desenvolvido com ❤️ para investidores brasileiros**

Última atualização: 2026-02-07
