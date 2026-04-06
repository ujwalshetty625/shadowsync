import React from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 20; // radius = 20

export default function StatsBar({ stats }) {
  const { total = 0, matched = 0, diverged = 0, matchRate = '100.0' } = stats || {};
  const rateNum = parseFloat(matchRate);
  const offset = CIRCUMFERENCE - (rateNum / 100) * CIRCUMFERENCE;

  return (
    <section className="stats-bar" id="stats-bar">
      {/* Total Requests */}
      <div className="stat-card stat-card--total">
        <div className="stat-card__icon">📡</div>
        <div className="stat-card__label">Total Requests</div>
        <div className="stat-card__value">{total}</div>
      </div>

      {/* Matched */}
      <div className="stat-card stat-card--matched">
        <div className="stat-card__icon">✅</div>
        <div className="stat-card__label">Matched</div>
        <div className="stat-card__value">{matched}</div>
      </div>

      {/* Diverged */}
      <div className="stat-card stat-card--diverged">
        <div className="stat-card__icon">🔴</div>
        <div className="stat-card__label">Diverged</div>
        <div className="stat-card__value">{diverged}</div>
      </div>

      {/* Match Rate */}
      <div className="stat-card stat-card--rate">
        <div className="stat-card__icon">📊</div>
        <div className="stat-card__label">Match Rate</div>
        <div className="stat-card__value">
          {rateNum.toFixed(1)}
          <span className="stat-card__unit">%</span>
        </div>
        <div className="rate-ring">
          <svg width="52" height="52" viewBox="0 0 44 44">
            <circle className="rate-ring__bg" cx="22" cy="22" r="20" />
            <circle
              className="rate-ring__fill"
              cx="22"
              cy="22"
              r="20"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
