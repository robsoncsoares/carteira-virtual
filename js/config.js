// ===== CONFIGURAÇÃO DO FIREBASE =====
// Substitua com suas credenciais reais do Firebase Console

const firebaseConfig = {
    apiKey: "AIzaSyDO7Qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxxxxxx",
    databaseURL: "https://seu-projeto.firebaseio.com"
};

// ===== INICIALIZAR FIREBASE =====
let app;
let auth;
let db;

try {
    // Iniciar Firebase
    firebase.initializeApp(firebaseConfig);
    app = firebase.app();
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('Firebase inicializado com sucesso');
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    // Mostrar mensagem de aviso ao usuário
    document.addEventListener('DOMContentLoaded', () => {
        const authContainer = document.getElementById('auth-container');
        if (authContainer) {
            const warning = document.createElement('div');
            warning.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fff3cd;color:#856404;padding:15px;text-align:center;z-index:9999;';
            warning.innerHTML = '⚠️ Configure suas credenciais do Firebase em <code>js/config.js</code>';
            document.body.insertBefore(warning, document.body.firstChild);
        }
    });
}

// ===== DADOS MOCKADOS (para testes sem Firebase) =====
const mockData = {
    currentUser: null,
    assets: [],
    transactions: [],
    portfolioHistory: [
        { date: '2024-01-01', value: 10000 },
        { date: '2024-02-01', value: 10500 },
        { date: '2024-03-01', value: 11200 },
        { date: '2024-04-01', value: 11800 },
        { date: '2024-05-01', value: 12500 },
        { date: '2024-06-01', value: 13200 },
    ]
};

// ===== CONSTANTES =====
const ASSET_TYPES = {
    acao: 'Ação',
    fundo: 'Fundo de Investimento',
    cripto: 'Criptomoeda',
    'renda-fixa': 'Renda Fixa'
};

const CURRENCY_SYMBOL = 'R$';

// ===== PREÇOS SIMULADOS (em produção, usar API de dados reais) =====
const currentPrices = {
    'PETR4': { price: 27.50, change: 2.5 },
    'VALE3': { price: 58.90, change: -1.2 },
    'ITUB4': { price: 9.85, change: 1.8 },
    'BBDC4': { price: 19.45, change: 0.5 },
    'WEGE3': { price: 34.20, change: 3.2 },
    'BTC': { price: 95000, change: 5.5 },
    'ETH': { price: 3400, change: 4.2 }
};

// ===== FUNÇÕES AUXILIARES =====
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
}

function formatPercent(value) {
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

// ===== STORAGE LOCAL (backup para funcionar sem Firebase) =====
const StorageManager = {
    saveAssets: function(assets) {
        localStorage.setItem('assets', JSON.stringify(assets));
        mockData.assets = assets;
    },
    
    getAssets: function() {
        const stored = localStorage.getItem('assets');
        return stored ? JSON.parse(stored) : mockData.assets;
    },
    
    saveTransactions: function(transactions) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        mockData.transactions = transactions;
    },
    
    getTransactions: function() {
        const stored = localStorage.getItem('transactions');
        return stored ? JSON.parse(stored) : mockData.transactions;
    },
    
    saveUser: function(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        mockData.currentUser = user;
    },
    
    getUser: function() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : mockData.currentUser;
    }
};
