import React from 'react';

export default function RequestDetail({ entry }) {
  const main = entry.main || {};
  const shadow = entry.shadow || {};

  const mainStatusOk = main.status >= 200 && main.status < 300;
  const shadowStatusOk = shadow.status >= 200 && shadow.status < 300;

  const formatBody = (obj) => {
    if (!obj) return '—';
    if (typeof obj === 'string') return obj;
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <div className="detail" id={`detail-${entry.id}`}>
      <div className="detail__grid">
        {/* ── Main App Panel ── */}
        <div className="detail__panel detail__panel--main">
          <div className="detail__panel-title">
            🟢 Main App (v1)
            <span className={`detail__diff-badge ${entry.match ? 'detail__diff-badge--match' : 'detail__diff-badge--diverge'}`}>
              {entry.match ? 'Baseline' : 'Source of truth'}
            </span>
          </div>

          <div className="detail__row">
            <span className="detail__row-label">Status</span>
            <span className={`detail__row-value ${mainStatusOk ? 'detail__row-value--ok' : 'detail__row-value--error'}`}>
              {main.status || 'N/A'}
            </span>
          </div>

          <div className="detail__row">
            <span className="detail__row-label">Latency</span>
            <span className="detail__row-value">
              {main.latency != null ? `${main.latency}ms` : '—'}
            </span>
          </div>

          {main.error && (
            <div className="detail__row">
              <span className="detail__row-label">Error</span>
              <span className="detail__row-value detail__row-value--error">{main.error}</span>
            </div>
          )}

          <div className="detail__body">
            <div className="detail__body-label">Response Body</div>
            <pre className="detail__body-content">
              {main.data ? formatBody(main.data) : (main.error || '—')}
            </pre>
          </div>
        </div>

        {/* ── Shadow App Panel ── */}
        <div className="detail__panel detail__panel--shadow">
          <div className="detail__panel-title">
            🔴 Shadow App (v2)
            <span className={`detail__diff-badge ${entry.match ? 'detail__diff-badge--match' : 'detail__diff-badge--diverge'}`}>
              {entry.match ? 'Matching' : 'Diverged'}
            </span>
          </div>

          <div className="detail__row">
            <span className="detail__row-label">Status</span>
            <span className={`detail__row-value ${shadowStatusOk ? 'detail__row-value--ok' : 'detail__row-value--error'}`}>
              {shadow.status || 'N/A'}
            </span>
          </div>

          <div className="detail__row">
            <span className="detail__row-label">Latency</span>
            <span className="detail__row-value">
              {shadow.latency != null ? `${shadow.latency}ms` : '—'}
            </span>
          </div>

          {shadow.error && (
            <div className="detail__row">
              <span className="detail__row-label">Error</span>
              <span className="detail__row-value detail__row-value--error">{shadow.error}</span>
            </div>
          )}

          <div className="detail__body">
            <div className="detail__body-label">Response Body</div>
            <pre className="detail__body-content">
              {shadow.data ? formatBody(shadow.data) : (shadow.error || '—')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
