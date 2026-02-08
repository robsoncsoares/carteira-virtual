export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatPercentage = (value) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const calculateRentabilidade = (precoCompra, precoAtual) => {
  return ((precoAtual - precoCompra) / precoCompra) * 100;
};

export const calculateValorTotal = (quantidade, preco) => {
  return quantidade * preco;
};

export const getTipoLabel = (tipo) => {
  const labels = {
    'acao': 'Ação',
    'fundo': 'Fundo de Investimento',
    'cripto': 'Criptomoeda',
    'renda-fixa': 'Renda Fixa',
    'outro': 'Outro'
  };
  return labels[tipo] || tipo;
};

export const getTipoColor = (tipo) => {
  const colors = {
    'acao': '#3b82f6',
    'fundo': '#8b5cf6',
    'cripto': '#f59e0b',
    'renda-fixa': '#10b981',
    'outro': '#6b7280'
  };
  return colors[tipo] || '#6b7280';
};
