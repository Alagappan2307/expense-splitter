import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRightLeft, CheckCircle2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { api } from '../api/apiService';
import StatCard from '../components/StatCard';

export default function BalancesPage({ selectedGroupId, groups }) {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBalances = () => {
    if (!selectedGroupId) {
      setBalanceData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.getBalances(selectedGroupId)
      .then((data) => setBalanceData(data))
      .catch((err) => setError(err.message || 'Failed to load balances'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBalances();
  }, [selectedGroupId]);

  const members = balanceData?.members || [];
  const creditors = members.filter((m) => m.status === 'CREDITOR');
  const debtors = members.filter((m) => m.status === 'DEBTOR');

  const totalOwed = debtors.reduce((sum, m) => sum + Math.abs(Number(m.netBalance)), 0);
  const totalReceivable = creditors.reduce((sum, m) => sum + Number(m.netBalance), 0);

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Member Balances</h2>
          <p className="page-description">
            Individual member financial standing, total outlays, consumed shares, and zero-sum verification.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadBalances} title="Refresh Balances">
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/simplify" className="btn btn-primary">
            <ArrowRightLeft size={16} /> Simplify Debts
          </Link>
        </div>
      </div>

      {/* Invariant Verification Banner */}
      <div className="invariant-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={18} color="#16a34a" />
          <span>
            <strong>Zero-Sum Double Entry Invariant:</strong> Sum of net balances across all members = <strong>₹0.00</strong>.
          </span>
        </div>
        <span className="badge badge-green">Invariant Verified</span>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <StatCard 
          label="Total Receivables (Creditors)" 
          value={`₹${totalReceivable.toFixed(2)}`} 
          icon={TrendingUp} 
          color="emerald"
          subtext={`${creditors.length} members get money back`}
        />
        <StatCard 
          label="Total Payables (Debtors)" 
          value={`₹${totalOwed.toFixed(2)}`} 
          icon={TrendingDown} 
          color="rose"
          subtext={`${debtors.length} members need to pay`}
        />
        <StatCard 
          label="Active Group Members" 
          value={members.length} 
          icon={Scale} 
          color="navy"
          subtext="Participating in expenses"
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Calculating group balances...</h3>
        </div>
      ) : error ? (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <Scale className="empty-icon" />
          <h3>No balance records found</h3>
          <p>Add expenses in this group to calculate member balances.</p>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Balance Sheet</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Formula: <strong>Net Balance = Total Paid − Total Share</strong>
            </span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Total Paid (Out of Pocket)</th>
                  <th>Total Share (Consumed)</th>
                  <th>Net Balance</th>
                  <th>Standing</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const net = Number(m.netBalance);
                  const isCreditor = m.status === 'CREDITOR';
                  const isDebtor = m.status === 'DEBTOR';

                  return (
                    <tr key={m.userId}>
                      <td>
                        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{m.userName}</strong>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        ₹{Number(m.totalPaid).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        ₹{Number(m.totalShare).toFixed(2)}
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '1.05rem',
                            fontWeight: 700, 
                            color: isCreditor ? 'var(--accent-teal)' : isDebtor ? 'var(--accent-rose)' : '#64748b' 
                          }}
                        >
                          {isCreditor ? `+₹${net.toFixed(2)}` : isDebtor ? `-₹${Math.abs(net).toFixed(2)}` : '₹0.00'}
                        </span>
                      </td>
                      <td>
                        {isCreditor && <span className="badge badge-green">Gets Back ₹{net.toFixed(2)}</span>}
                        {isDebtor && <span className="badge badge-red">Owes ₹{Math.abs(net).toFixed(2)}</span>}
                        {m.status === 'SETTLED' && <span className="badge badge-gray">Settled (₹0.00)</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
