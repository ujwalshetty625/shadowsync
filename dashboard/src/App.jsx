import React from 'react';
import StatsBar from './components/StatsBar.jsx';
import RequestFeed from './components/RequestFeed.jsx';
import { usePolling } from './hooks/usePolling.js';

const POLL_INTERVAL = 2000;

export default function App() {
  const { data: stats, error: statsError } = usePolling('/__shadow/stats', POLL_INTERVAL);
  const { data: logs, error: logsError } = usePolling('/__shadow/logs', POLL_INTERVAL);

  const isConnected = !statsError && !logsError;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header" id="header">
        <div className="header__brand">
          <div className="header__icon">🌑</div>
          <div>
            <h1 className="header__title">ShadowSync</h1>
            <p className="header__subtitle">Live Traffic Dashboard</p>
          </div>
        </div>
        <div className="header__status">
          <span
            className="header__pulse"
            style={!isConnected ? { background: 'var(--accent-red)', animationName: 'none' } : undefined}
          />
          {isConnected ? 'Polling live · 2s interval' : 'Proxy unreachable'}
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <StatsBar stats={stats} />

      {/* ── Request Feed ── */}
      <RequestFeed logs={logs} />
    </div>
  );
}
