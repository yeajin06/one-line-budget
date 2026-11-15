import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { LedgerProvider } from './context/LedgerContext';
import LedgerPage from './pages/LedgerPage';
import StatsPage from './pages/StatsPage';
import './App.css';

const tabClass = ({ isActive }) => (isActive ? 'tab tab-active' : 'tab');

export default function App() {
  return (
    <BrowserRouter>
      <LedgerProvider>
        <main className="app">
          <h1 className="app-title">한 줄 가계부</h1>
          <nav className="tabs">
            <NavLink to="/" end className={tabClass}>가계부</NavLink>
            <NavLink to="/stats" className={tabClass}>통계</NavLink>
          </nav>
          <Routes>
            <Route path="/" element={<LedgerPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<p className="empty">없는 페이지예요.</p>} />
          </Routes>
          <footer className="app-footer">환율: Frankfurter (유럽중앙은행 기준)</footer>
        </main>
      </LedgerProvider>
    </BrowserRouter>
  );
}
