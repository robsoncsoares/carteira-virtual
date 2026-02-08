import { LogOut, Home, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ onAddAtivo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Home size={24} />
          <span>Carteira Virtual</span>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-success" onClick={onAddAtivo}>
            <PlusCircle size={18} />
            Adicionar Ativo
          </button>
          
          <div className="navbar-user">
            <span>{user?.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
