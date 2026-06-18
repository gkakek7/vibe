import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import './TopNav.css';

const MENUS = [
  { label: '포탈', path: '/' },
  { label: '전자결재', path: '/approval' },
  { label: '게시판', path: '/board', external: 'http://localhost:3002' },
  { label: '조직도', path: '/orgchart' },
];

export default function TopNav({ onAdminClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (menu) => {
    if (menu.external) {
      window.open(menu.external, '_blank');
    } else {
      navigate(menu.path);
    }
  };

  return (
    <nav className="topnav">
      <div className="topnav-logo" onClick={() => navigate('/')}>VIBE</div>
      <ul className="topnav-menus">
        {MENUS.map((m) => (
          <li
            key={m.path}
            className={`topnav-item ${location.pathname === m.path ? 'active' : ''}`}
            onClick={() => handleMenu(m)}
          >
            {m.label}
          </li>
        ))}
      </ul>
      <div className="topnav-user">
        <span>{user?.name}님</span>
        {user?.role === 'ROLE_ADMIN' && (
          <button className="topnav-admin-btn" onClick={onAdminClick} title="관리자">🔒</button>
        )}
        <button onClick={logout}>로그아웃</button>
      </div>
    </nav>
  );
}
