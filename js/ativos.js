// ===== GERENCIAMENTO DE ATIVOS =====

function openAddAssetModal() {
    document.getElementById('asset-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Formulário de adicionar ativo
document.addEventListener('DOMContentLoaded', () => {
    const assetForm = document.getElementById('asset-form');
    if (assetForm) {
        assetForm.addEventListener('submit', handleAddAsset);
    }
    
    // Busca de ativos
    const searchAssets = document.getElementById('search-assets');
    if (searchAssets) {
        searchAssets.addEventListener('input', filterAssets);
    }
    
    // Selecionar data de hoje
    const assetDate = document.getElementById('asset-date');
    if (assetDate) {
        const today = new Date().toISOString().split('T')[0];
        assetDate.value = today;
    }
});

async function handleAddAsset(e) {
    e.preventDefault();
    
    const ticker = document.getElementById('asset-ticker').value.toUpperCase();
    const quantity = parseFloat(document.getElementById('asset-quantity').value);
    const price = parseFloat(document.getElementById('asset-price').value);
    const type = document.getElementById('asset-type').value;
    const date = document.getElementById('asset-date').value;
    
    // Validações
    if (!ticker || quantity <= 0 || price <= 0) {
        alert('Preencha todos os campos corretamente');
        return;
    }
    
    // Criar objeto do ativo
    const newAsset = {
        id: 'asset-' + Date.now(),
        ticker: ticker,
        quantity: quantity,
        price: price,
        type: type,
        purchaseDate: date,
        createdAt: new Date().toISOString()
    };
    
    try {
        // Se Firebase está disponível
        if (typeof db !== 'undefined') {
            const user = StorageManager.getUser();
            await db.collection('users').doc(user.uid).collection('assets').add(newAsset);
        }
        
        // Salvar localmente
        const assets = StorageManager.getAssets();
        assets.push(newAsset);
        StorageManager.saveAssets(assets);
        
        // Registrar transação de compra
        const transaction = {
            id: 'trans-' + Date.now(),
            type: 'compra',
            ticker: ticker,
            quantity: quantity,
            price: price,
            total: quantity * price,
            date: date,
            createdAt: new Date().toISOString()
        };
        
        const transactions = StorageManager.getTransactions();
        transactions.push(transaction);
        StorageManager.saveTransactions(transactions);
        
        // Limpar formulário
        document.getElementById('asset-form').reset();
        
        // Fechar modal
        closeModal('asset-modal');
        
        // Atualizar visualizações
        loadAtivos();
        loadDashboard();
        loadTransactions();
        
        alert('Ativo adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar ativo:', error);
        alert('Erro ao adicionar ativo. Tente novamente.');
    }
}

function loadAtivos() {
    const assets = StorageManager.getAssets();
    const tbody = document.getElementById('assets-tbody');
    
    if (!assets.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">Nenhum ativo adicionado. Clique em "+ Novo Ativo" para começar!</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = assets.map(asset => {
        const currentPrice = currentPrices[asset.ticker]?.price || asset.price;
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.quantity * asset.price;
        const gain = currentValue - investedValue;
        const gainPercent = ((gain / investedValue) * 100).toFixed(2);
        
        const gainClass = gain >= 0 ? 'positive' : 'negative';
        const gainSign = gain >= 0 ? '+' : '';
        
        return `
            <tr>
                <td><strong>${asset.ticker}</strong></td>
                <td>${asset.quantity}</td>
                <td>${formatCurrency(asset.price)}</td>
                <td>${formatCurrency(currentValue)}</td>
                <td class="${gainClass}">${gainSign}${formatCurrency(gain)}</td>
                <td class="${gainClass}">${gainSign}${gainPercent}%</td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="editAsset('${asset.id}')">Editar</button>
                    <button class="btn btn-small btn-danger" onclick="deleteAsset('${asset.id}')">Remover</button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterAssets(e) {
    const search = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#assets-tbody tr');
    
    rows.forEach(row => {
        const ticker = row.querySelector('td').textContent.toLowerCase();
        if (ticker.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function editAsset(assetId) {
    alert('Funcionalidade de edição em desenvolvimento');
}

function deleteAsset(assetId) {
    if (!confirm('Tem certeza que deseja remover este ativo?')) {
        return;
    }
    
    try {
        const assets = StorageManager.getAssets();
        const index = assets.findIndex(a => a.id === assetId);
        
        if (index !== -1) {
            const deleted = assets[index];
            
            // Se Firebase está disponível
            if (typeof db !== 'undefined') {
                const user = StorageManager.getUser();
                db.collection('users').doc(user.uid).collection('assets').doc(assetId).delete();
            }
            
            assets.splice(index, 1);
            StorageManager.saveAssets(assets);
            
            // Registrar transação de venda
            const transaction = {
                id: 'trans-' + Date.now(),
                type: 'venda',
                ticker: deleted.ticker,
                quantity: deleted.quantity,
                price: currentPrices[deleted.ticker]?.price || deleted.price,
                total: deleted.quantity * (currentPrices[deleted.ticker]?.price || deleted.price),
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            
            const transactions = StorageManager.getTransactions();
            transactions.push(transaction);
            StorageManager.saveTransactions(transactions);
            
            loadAtivos();
            loadDashboard();
            loadTransactions();
            
            alert('Ativo removido com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao remover ativo:', error);
        alert('Erro ao remover ativo. Tente novamente.');
    }
}

function loadTransactions() {
    const transactions = StorageManager.getTransactions();
    const container = document.getElementById('transactions-list');
    
    if (!transactions.length) {
        container.innerHTML = '<p class="empty-message" style="text-align:center;padding:30px 0;">Nenhuma transação realizada</p>';
        return;
    }
    
    // Aplicar filtros
    const typeFilter = document.getElementById('transaction-filter')?.value || '';
    const dateFrom = document.getElementById('date-from')?.value;
    const dateTo = document.getElementById('date-to')?.value;
    
    let filtered = [...transactions];
    
    if (typeFilter) {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (dateFrom) {
        filtered = filtered.filter(t => t.date >= dateFrom);
    }
    
    if (dateTo) {
        filtered = filtered.filter(t => t.date <= dateTo);
    }
    
    // Ordenar por data descendente
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = filtered.map(trans => {
        const typeLabel = trans.type === 'compra' ? 'Compra de' : 'Venda de';
        const icon = trans.type === 'compra' ? '📈' : '📉';
        
        return `
            <div class="transaction-item ${trans.type}">
                <div class="transaction-info">
                    <h4>${icon} ${typeLabel} ${trans.ticker}</h4>
                    <p>${trans.quantity} unidades × ${formatCurrency(trans.price)}</p>
                    <p>${formatDate(trans.date)}</p>
                </div>
                <div class="transaction-amount">
                    <strong>${trans.type === 'compra' ? '-' : '+'}${formatCurrency(trans.total)}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    // Listeners dos filtros
    const typeFilterEl = document.getElementById('transaction-filter');
    const dateFromEl = document.getElementById('date-from');
    const dateToEl = document.getElementById('date-to');
    
    if (typeFilterEl && !typeFilterEl.hasAttribute('data-listener')) {
        typeFilterEl.setAttribute('data-listener', 'true');
        typeFilterEl.addEventListener('change', loadTransactions);
    }
    
    if (dateFromEl && !dateFromEl.hasAttribute('data-listener')) {
        dateFromEl.setAttribute('data-listener', 'true');
        dateFromEl.addEventListener('change', loadTransactions);
    }
    
    if (dateToEl && !dateToEl.hasAttribute('data-listener')) {
        dateToEl.setAttribute('data-listener', 'true');
        dateToEl.addEventListener('change', loadTransactions);
    }
}
