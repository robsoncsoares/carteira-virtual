import { useState, useEffect } from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import AtivoModal from '../components/AtivoModal';
import { getUserAtivos, deleteAtivo } from '../services/ativos';
import { useAuth } from '../contexts/AuthContext';
import {
  formatCurrency,
  formatPercentage,
  calculateRentabilidade,
  calculateValorTotal,
  getTipoLabel,
  getTipoColor
} from '../utils/formatters';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [ativos, setAtivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAtivo, setEditingAtivo] = useState(null);

  const loadAtivos = async () => {
    setLoading(true);
    const { ativos: data, error } = await getUserAtivos(user.uid);
    if (!error) {
      setAtivos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAtivos();
  }, [user]);

  const handleDeleteAtivo = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ativo?')) {
      const { error } = await deleteAtivo(id);
      if (!error) {
        loadAtivos();
      }
    }
  };

  const handleEditAtivo = (ativo) => {
    setEditingAtivo(ativo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAtivo(null);
  };

  const handleModalSuccess = () => {
    loadAtivos();
  };

  // Cálculos
  const totalInvestido = ativos.reduce((acc, ativo) => 
    acc + calculateValorTotal(ativo.quantidade, ativo.precoCompra), 0
  );

  const totalAtual = ativos.reduce((acc, ativo) => 
    acc + calculateValorTotal(ativo.quantidade, ativo.precoAtual), 0
  );

  const lucroTotal = totalAtual - totalInvestido;
  const rentabilidadeTotal = totalInvestido > 0 
    ? ((totalAtual - totalInvestido) / totalInvestido) * 100 
    : 0;

  // Dados para o gráfico de pizza
  const tiposData = ativos.reduce((acc, ativo) => {
    const tipo = ativo.tipo;
    const valor = calculateValorTotal(ativo.quantidade, ativo.precoAtual);
    
    const existing = acc.find(item => item.name === getTipoLabel(tipo));
    if (existing) {
      existing.value += valor;
    } else {
      acc.push({ 
        name: getTipoLabel(tipo), 
        value: valor,
        color: getTipoColor(tipo)
      });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <>
        <Navbar onAddAtivo={() => setModalOpen(true)} />
        <div className="dashboard-container">
          <p>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onAddAtivo={() => setModalOpen(true)} />
      
      <div className="dashboard-container">
        {/* Cards de resumo */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              <Wallet size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Investido</p>
              <p className="stat-value">{formatCurrency(totalInvestido)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
              <TrendingUp size={24} style={{ color: '#10b981' }} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Valor Atual</p>
              <p className="stat-value">{formatCurrency(totalAtual)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ 
              backgroundColor: lucroTotal >= 0 ? '#dcfce7' : '#fee2e2' 
            }}>
              {lucroTotal >= 0 ? (
                <TrendingUp size={24} style={{ color: '#10b981' }} />
              ) : (
                <TrendingDown size={24} style={{ color: '#ef4444' }} />
              )}
            </div>
            <div className="stat-content">
              <p className="stat-label">Lucro/Prejuízo</p>
              <p className="stat-value" style={{ 
                color: lucroTotal >= 0 ? '#10b981' : '#ef4444' 
              }}>
                {formatCurrency(lucroTotal)}
              </p>
              <p className="stat-percentage" style={{ 
                color: lucroTotal >= 0 ? '#10b981' : '#ef4444' 
              }}>
                {formatPercentage(rentabilidadeTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico e lista */}
        <div className="dashboard-grid">
          {/* Gráfico de distribuição */}
          {tiposData.length > 0 && (
            <div className="card chart-card">
              <h2>Distribuição por Tipo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tiposData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${((entry.value / totalAtual) * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tiposData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Lista de ativos */}
          <div className="card ativos-list-card">
            <h2>Meus Ativos</h2>
            
            {ativos.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não possui ativos cadastrados.</p>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                  Adicionar Primeiro Ativo
                </button>
              </div>
            ) : (
              <div className="ativos-list">
                {ativos.map((ativo) => {
                  const rentabilidade = calculateRentabilidade(ativo.precoCompra, ativo.precoAtual);
                  const valorTotal = calculateValorTotal(ativo.quantidade, ativo.precoAtual);
                  const lucro = valorTotal - calculateValorTotal(ativo.quantidade, ativo.precoCompra);

                  return (
                    <div key={ativo.id} className="ativo-item">
                      <div className="ativo-header">
                        <div>
                          <h3>{ativo.nome}</h3>
                          <span className="ativo-tipo" style={{ 
                            backgroundColor: getTipoColor(ativo.tipo) + '20',
                            color: getTipoColor(ativo.tipo)
                          }}>
                            {getTipoLabel(ativo.tipo)}
                          </span>
                        </div>
                        <div className="ativo-actions">
                          <button 
                            className="icon-btn"
                            onClick={() => handleEditAtivo(ativo)}
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="icon-btn danger"
                            onClick={() => handleDeleteAtivo(ativo.id)}
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="ativo-details">
                        <div className="ativo-detail">
                          <span className="detail-label">Quantidade:</span>
                          <span className="detail-value">{ativo.quantidade}</span>
                        </div>
                        <div className="ativo-detail">
                          <span className="detail-label">Preço Compra:</span>
                          <span className="detail-value">{formatCurrency(ativo.precoCompra)}</span>
                        </div>
                        <div className="ativo-detail">
                          <span className="detail-label">Preço Atual:</span>
                          <span className="detail-value">{formatCurrency(ativo.precoAtual)}</span>
                        </div>
                        <div className="ativo-detail">
                          <span className="detail-label">Valor Total:</span>
                          <span className="detail-value strong">{formatCurrency(valorTotal)}</span>
                        </div>
                        <div className="ativo-detail">
                          <span className="detail-label">Lucro/Prejuízo:</span>
                          <span className="detail-value" style={{ 
                            color: lucro >= 0 ? '#10b981' : '#ef4444',
                            fontWeight: 600
                          }}>
                            {formatCurrency(lucro)} ({formatPercentage(rentabilidade)})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AtivoModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        ativo={editingAtivo}
      />
    </>
  );
};

export default Dashboard;
