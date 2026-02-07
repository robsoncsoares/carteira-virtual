// ===== FUNÇÕES UTILITÁRIAS =====

// Função para abrir modais
function openModalByEvent(event) {
    const target = event.target;
    const modalId = target.getAttribute('data-modal');
    if (modalId) {
        document.getElementById(modalId).classList.add('show');
    }
}

// Debounce para funções que serão chamadas múltiplas vezes
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Simular atualização de preços em tempo real
setInterval(() => {
    // Atualizar preços simulados aleatoriamente
    Object.keys(currentPrices).forEach(ticker => {
        const change = (Math.random() - 0.5) * 2;
        currentPrices[ticker].price += change;
        currentPrices[ticker].change += (Math.random() - 0.5) * 0.5;
    });
    
    // Atualizar dashboard se estiver ativo
    if (document.getElementById('dashboard-page').classList.contains('active')) {
        loadDashboard();
    }
}, 5000); // Atualizar a cada 5 segundos

// Exportar dados como CSV
function exportAsCSV() {
    const assets = StorageManager.getAssets();
    
    let csv = 'Ticker,Quantidade,Preço Médio,Valor Atual,Ganho/Perda,Percentual\n';
    
    assets.forEach(asset => {
        const currentPrice = currentPrices[asset.ticker]?.price || asset.price;
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.quantity * asset.price;
        const gain = currentValue - investedValue;
        const gainPercent = ((gain / investedValue) * 100).toFixed(2);
        
        csv += `${asset.ticker},${asset.quantity},${asset.price},${currentPrice},${gain},${gainPercent}%\n`;
    });
    
    downloadCSV(csv, 'portfólio.csv');
}

// Fazer download do arquivo CSV
function downloadCSV(csv, filename) {
    const link = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Formatar número com separadores
function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// Calcular média móvel
function calculateMovingAverage(array, period) {
    const result = [];
    for (let i = period - 1; i < array.length; i++) {
        const sum = array.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
    }
    return result;
}

// Calcular correlação entre ativos
function calculateCorrelation(asset1Returns, asset2Returns) {
    const n = Math.min(asset1Returns.length, asset2Returns.length);
    if (n === 0) return 0;
    
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, sum12 = 0;
    
    for (let i = 0; i < n; i++) {
        sum1 += asset1Returns[i];
        sum2 += asset2Returns[i];
        sum1Sq += asset1Returns[i] * asset1Returns[i];
        sum2Sq += asset2Returns[i] * asset2Returns[i];
        sum12 += asset1Returns[i] * asset2Returns[i];
    }
    
    const numerator = sum12 - (sum1 * sum2) / n;
    const denominator = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Gerar relatório PDF (simplificado)
function generateReport() {
    const assets = StorageManager.getAssets();
    const user = StorageManager.getUser();
    
    let report = `
================================
    RELATÓRIO DE PORTFÓLIO
================================

Usuário: ${user.displayName}
Email: ${user.email}
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO DO PORTFÓLIO
-------------------
Total de Ativos: ${assets.length}
Data: ${new Date().toLocaleDateString('pt-BR')}

DETALHES DOS ATIVOS
--------------------
`;
    
    assets.forEach(asset => {
        const currentPrice = currentPrices[asset.ticker]?.price || asset.price;
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.quantity * asset.price;
        const gain = currentValue - investedValue;
        
        report += `
${asset.ticker}
  Quantidade: ${asset.quantity}
  Preço Médio: ${formatCurrency(asset.price)}
  Preço Atual: ${formatCurrency(currentPrice)}
  Valor Investido: ${formatCurrency(investedValue)}
  Valor Atual: ${formatCurrency(currentValue)}
  Ganho/Perda: ${formatCurrency(gain)} (${formatPercent((gain/investedValue)*100)})
`;
    });
    
    alert('Relatório gerado:\n\n' + report);
}

// Impressão
function printPortfolio() {
    window.print();
}

// Notificação ao usuário
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    const colors = {
        'info': '#2563eb',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444'
    };
    
    notification.style.backgroundColor = colors[type] || colors['info'];
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sincronizar com Firebase
async function syncWithFirebase() {
    try {
        if (typeof db === 'undefined') {
            console.warn('Firebase não está configurado');
            return;
        }
        
        const user = StorageManager.getUser();
        if (!user) return;
        
        // Sincronizar ativos
        const assets = StorageManager.getAssets();
        const assetsRef = db.collection('users').doc(user.uid).collection('assets');
        
        // Sincronizar transações
        const transactions = StorageManager.getTransactions();
        const transRef = db.collection('users').doc(user.uid).collection('transactions');
        
        console.log('Sincronizando com Firebase...');
        showNotification('Dados sincronizados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao sincronizar:', error);
        showNotification('Erro ao sincronizar dados', 'error');
    }
}

// Sincronizar periodicamente
setInterval(() => {
    syncWithFirebase();
}, 30000); // A cada 30 segundos

// Add CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .positive {
        color: #10b981 !important;
    }
    
    .negative {
        color: #ef4444 !important;
    }
`;
document.head.appendChild(style);
