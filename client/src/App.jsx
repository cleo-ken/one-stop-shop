import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RoleSwitcher from './components/RoleSwitcher.jsx';
import DiscoveryPage from './pages/DiscoveryPage.jsx';
import TitleDetailPage from './pages/TitleDetailPage.jsx';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

function App() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('Viewer');

  useEffect(() => {
    let ignore = false;
    fetchJson(`${API_BASE}/roles`)
      .then((data) => {
        if (ignore) {
          return;
        }
        setRoles(data);
        const viewerExists = data.find((item) => item.role === 'Viewer');
        const fallbackRole = viewerExists ? 'Viewer' : data[0]?.role;
        if (fallbackRole) {
          setRole((currentRole) => {
            const stillValid = data.some((item) => item.role === currentRole);
            return stillValid ? currentRole : fallbackRole;
          });
        }
      })
      .catch((error) => {
        if (!ignore) {
          console.error(error);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const roleDescription = useMemo(() => {
    return roles.find((item) => item.role === role)?.description;
  }, [roles, role]);

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div>
          <p className="eyebrow">Internal content browser</p>
          <h1>One-Stop-Shop</h1>
          <p className="subtitle">Browse 50,000+ packages with RL1-grade signals and marketing context.</p>
        </div>
        <RoleSwitcher roles={roles} value={role} onChange={setRole} description={roleDescription} />
      </header>

      <main className="content-layout">
        <Routes>
          <Route path="/" element={<DiscoveryPage role={role} />} />
          <Route path="/title/:titleId" element={<TitleDetailPage role={role} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
