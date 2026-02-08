import { useState } from 'react';
import { X } from 'lucide-react';
import { createAtivo, updateAtivo } from '../services/ativos';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Modal.css';

const AtivoModal = ({ isOpen, onClose, onSuccess, ativo = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: ativo?.nome || '',
    tipo: ativo?.tipo || 'acao',
    quantidade: ativo?.quantidade || '',
    precoCompra: ativo?.precoCompra || '',
    precoAtual: ativo?.precoAtual || '',
    dataCompra: ativo?.dataCompra || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const ativoData = {
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      precoCompra: parseFloat(formData.precoCompra),
      precoAtual: parseFloat(formData.precoAtual)
    };

    let result;
    if (ativo) {
      result = await updateAtivo(ativo.id, ativoData);
    } else {
      result = await createAtivo(user.uid, ativoData);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{ativo ? 'Editar Ativo' : 'Adicionar Ativo'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Nome do Ativo</label>
            <input
              type="text"
              name="nome"
              className="input"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: PETR4, Bitcoin, etc."
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Tipo</label>
            <select
              name="tipo"
              className="input"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="acao">Ação</option>
              <option value="fundo">Fundo de Investimento</option>
              <option value="cripto">Criptomoeda</option>
              <option value="renda-fixa">Renda Fixa</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                className="input"
                value={formData.quantidade}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Preço de Compra (R$)</label>
              <input
                type="number"
                name="precoCompra"
                className="input"
                value={formData.precoCompra}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Preço Atual (R$)</label>
              <input
                type="number"
                name="precoAtual"
                className="input"
                value={formData.precoAtual}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Data de Compra</label>
              <input
                type="date"
                name="dataCompra"
                className="input"
                value={formData.dataCompra}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : ativo ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AtivoModal;
