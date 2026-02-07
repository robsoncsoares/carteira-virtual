// ===== DASHBOARD E GRÁFICOS =====

let portfolioChart = null;
let performanceChart = null;
let riskChart = null;
let monthlyChart = null;

function switchPage(page) {
    // Ocultar todas as páginas
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Remover active dos nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mostrar página selecionada
    document.getElementById(page + '-page').classList.add('active');
    
    // Ativar item de navegação
    event.target.classList.add('active');
    
    // Fechar sidebar em mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
    
    // Atualizar título
    const titles = {
        'dashboard': 'Dashboard',
        'ativos': 'Meus Ativos',
        'transacoes': 'Transações',
        'analise': 'Análise',
        'perfil': 'Perfil'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';
    
    // Recriar gráficos se necessário
    setTimeout(() => {
        if (page === 'dashboard') {
            if (portfolioChart) portfolioChart.resize();
            if (performanceChart) performanceChart.resize();
        } else if (page === 'analise') {
            if (riskChart) riskChart.resize();
            if (monthlyChart) monthlyChart.resize();
        }
    }, 100);
}

function loadDashboard() {
    const assets = StorageManager.getAssets();
    const transactions = StorageManager.getTransactions();
    
    // Calcular totais
    let totalValue = 0;
    let totalInvested = 0;
    let totalGain = 0;
    
    assets.forEach(asset => {
        const currentPrice = currentPrices[asset.ticker]?.price || asset.price;
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.quantity * asset.price;
        
        totalValue += currentValue;
        totalInvested += investedValue;
        totalGain += (currentValue - investedValue);
    });
    
    // Atualizar cards
    document.getElementById('total-balance').textContent = formatCurrency(totalValue);
    document.getElementById('total-invested').textContent = formatCurrency(totalInvested);
    
    const gainPercent = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100) : 0;
    document.getElementById('total-gain').textContent = formatCurrency(totalGain);
    document.getElementById('gain-trend').textContent = formatPercent(gainPercent);
    
    // Diversificação
    document.getElementById('diversification').textContent = assets.length;
    
    // Gráfico de Portfólio (Pizza)
    createPortfolioChart(assets);
    
    // Gráfico de Performance (Linha)
    createPerformanceChart();
    
    // Top Assets
    displayTopAssets(assets);
}

function createPortfolioChart(assets) {
    const ctx = document.getElementById('portfolio-chart');
    if (!ctx) return;
    
    const labels = assets.map(a => a.ticker);
    const data = assets.map(a => {
        const currentPrice = currentPrices[a.ticker]?.price || a.price;
        return a.quantity * currentPrice;
    });
    
    const colors = [
        '#2563eb', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
    ];
    
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['Sem dados'],
            datasets: [{
                data: data.length > 0 ? data : [100],
                backgroundColor: colors.slice(0, labels.length),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((context.parsed / total) * 100).toFixed(1);
                            return formatCurrency(context.parsed) + ' (' + percent + '%)';
                        }
                    }
                }
            }
        }
    });
}

function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    const history = mockData.portfolioHistory;
    
    const labels = history.map(h => h.date);
    const data = history.map(h => h.value);
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor do Portfólio',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                }
            }
        }
    });
}

function displayTopAssets(assets) {
    const container = document.getElementById('top-assets');
    if (!assets.length) {
        container.innerHTML = '<p class="empty-message">Nenhum ativo no portfólio</p>';
        return;
    }
    
    const sorted = [...assets].sort((a, b) => {
        const aValue = a.quantity * (currentPrices[a.ticker]?.price || a.price);
        const bValue = b.quantity * (currentPrices[b.ticker]?.price || b.price);
        return bValue - aValue;
    }).slice(0, 5);
    
    container.innerHTML = sorted.map(asset => {
        const currentPrice = currentPrices[asset.ticker]?.price || asset.price;
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.quantity * asset.price;
        const gain = currentValue - investedValue;
        const gainPercent = ((gain / investedValue) * 100).toFixed(2);
        
        return `
            <div class="asset-item">
                <div class="asset-ticker">${asset.ticker}</div>
                <div class="asset-value">
                    <strong>${formatCurrency(currentValue)}</strong>
                    <span class="asset-percent ${gain >= 0 ? 'positive' : 'negative'}">
                        ${formatPercent(gainPercent)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function createRiskChart() {
    const ctx = document.getElementById('risk-chart');
    if (!ctx) return;
    
    if (riskChart) {
        riskChart.destroy();
    }
    
    riskChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Volatilidade', 'Liquidez', 'Concentração', 'Exposição', 'Diversificação'],
            datasets: [{
                label: 'Seu Portfólio',
                data: [65, 75, 45, 55, 70],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                pointBackgroundColor: '#2563eb',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                }
            }
        }
    });
}

function createMonthlyChart() {
    const ctx = document.getElementById('monthly-chart');
    if (!ctx) return;
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Ganhos',
                data: [500, 750, 1200, 800, 1500, 1200],
                backgroundColor: '#10b981'
            }, {
                label: 'Perdas',
                data: [-200, -150, -300, -200, -100, -150],
                backgroundColor: '#ef4444'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                }
            }
        }
    });
}

// Chamar quando analise é carregada
document.addEventListener('DOMContentLoaded', () => {
    // Ao clicar em Análise, criar gráficos
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-item') && e.target.textContent.includes('Análise')) {
            setTimeout(() => {
                createRiskChart();
                createMonthlyChart();
                
                // Atualizar estatísticas
                document.getElementById('volatility').textContent = '12.5%';
                document.getElementById('sharpe').textContent = '1.45';
                document.getElementById('roi').textContent = formatPercent(15.3);
            }, 100);
        }
    });
});
