import React, { useState } from 'react';
import RequestDetail from './RequestDetail.jsx';

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function RequestRow({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const isMatch = entry.match;
  const methodClass = `request-row__method request-row__method--${entry.method}`;

  return (
    <li
      className={`request-row ${expanded ? 'request-row--expanded' : ''}`}
      id={`row-${entry.id}`}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="request-row__summary">
        <span className={`request-row__status ${isMatch ? 'request-row__status--match' : 'request-row__status--diverge'}`} />
        <span className={methodClass}>{entry.method}</span>
        <span className="request-row__url">{entry.url}</span>
        <span className={`request-row__match-label ${isMatch ? 'request-row__match-label--match' : 'request-row__match-label--diverge'}`}>
          {isMatch ? '✅ Match' : '🔴 Diverged'}
        </span>
        <span className="request-row__time">{formatTime(entry.timestamp)}</span>
        <span className="request-row__chevron">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && <RequestDetail entry={entry} />}
    </li>
  );
}

export default function RequestFeed({ logs }) {
  const entries = logs || [];

  return (
    <section className="feed" id="request-feed">
      <div className="feed__header">
        <h2 className="feed__title">
          <span className="feed__title-icon">📋</span>
          Request Feed
        </h2>
        <span className="feed__count">{entries.length} requests</span>
      </div>

      {entries.length === 0 ? (
        <div className="feed__empty">
          <span className="feed__empty-icon">🛸</span>
          <p>No traffic yet. Start the load tester to see requests.</p>
        </div>
      ) : (
        <ul className="feed__list">
          {entries.map((entry) => (
            <RequestRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
