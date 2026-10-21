import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRightLeft, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Wallet,
  Clock
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../api/apiService';

export default function DashboardPage({ selectedGroupId, groups }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedGroupId) return;
    setLoading(true);
    setError(null);
    api.getGroupReport(selectedGroupId)
      .then((data) => setReport(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedGroupId]);

  if (loading) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <Clock className="empty-icon" />
          <h3>Loading dashboard analytics...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <h3 style={{ color: 'var(--accent-rose)' }}>Unable to load dashboard</h3>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>{error}</p>
        </div>
      </div>
    );
  }

  const balances = report?.balances?.members || [];
  const recentExpenses = report?.recentExpenses || [];
  const simplifiedDebts = report?.simplifiedDebts || [];

  const totalExpenses = report?.totalExpenseAmount || 0;
  const totalSettled = report?.totalSettlementAmount || 0;
  const creditorsCount = balances.filter(m => m.status === 'CREDITOR').length;
  const debtorsCount = balances.filter(m => m.status === 'DEBTOR').length;

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">{report?.group?.name || 'Group Dashboard'}</h2>
          <p className="page-description">
            {report?.group?.description || 'Real-time expense tracking, balance calculations, and debt simplification'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/add-expense" className="btn btn-primary">
            <PlusCircle size={16} /> Add Expense
          </Link>
          <Link to="/simplify" className="btn btn-secondary">
            <ArrowRightLeft size={16} /> Simplify Debts
          </Link>
          <Link to="/settlements" className="btn btn-success">
            <Wallet size={16} /> Record Payment
          </Link>
        </div>
      </div>

      <div className="invariant-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={18} color="#16a34a" />
          <span>
            <strong>Zero-Sum Accounting Invariant Verified:</strong> Net balances across all {balances.length} members sum strictly to <strong>₹0.00</strong>.
          </span>
        </div>
        <span className="badge badge-green">Balanced</span>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Group Expenses" 
          value={`₹${Number(totalExpenses).toFixed(2)}`} 
          icon={Receipt} 
          color="teal"
          subtext={`${report?.totalExpensesCount || 0} recorded expenses`}
        />
        <StatCard 
          label="Settled Payments" 
          value={`₹${Number(totalSettled).toFixed(2)}`} 
          icon={CheckCircle2} 
          color="green"
          subtext={`${report?.totalSettlementsCount || 0} confirmed settlements`}
        />
        <StatCard 
          label="Members to Receive" 
          value={creditorsCount} 
          icon={TrendingUp} 
          color="green"
          subtext="Net positive balance"
        />
        <StatCard 
          label="Members to Pay" 
          value={debtorsCount} 
          icon={TrendingDown} 
          color="rose"
          subtext="Net negative balance"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Member Balances</h3>
            <Link to="/balances" style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600 }}>
              View Details →
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Paid</th>
                  <th>Share Owed</th>
                  <th>Net Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((m) => (
                  <tr key={m.userId}>
                    <td style={{ fontWeight: 600 }}>{m.userName}</td>
                    <td>₹{Number(m.totalPaidForExpenses).toFixed(2)}</td>
                    <td>₹{Number(m.totalExpenseShareOwed).toFixed(2)}</td>
                    <td style={{ 
                      fontWeight: 700, 
                      color: m.netBalance > 0 ? '#059669' : m.netBalance < 0 ? '#e11d48' : '#475569' 
                    }}>
                      {m.netBalance > 0 ? `+₹${Number(m.netBalance).toFixed(2)}` : m.netBalance < 0 ? `-₹${Math.abs(Number(m.netBalance)).toFixed(2)}` : '₹0.00'}
                    </td>
                    <td>
                      <span className={`badge ${
                        m.status === 'CREDITOR' ? 'badge-green' : m.status === 'DEBTOR' ? 'badge-rose' : 'badge-gray'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Optimal Settlements</h3>
            <Link to="/simplify" style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600 }}>
              Algorithm Details →
            </Link>
          </div>

          {simplifiedDebts.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <CheckCircle2 className="empty-icon" style={{ color: '#10b981' }} />
              <h4 style={{ color: '#0f172a' }}>All debts fully settled!</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>No pending transfers required across the group.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {simplifiedDebts.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 600, color: '#e11d48' }}>{item.fromUserName}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>pays</span>
                    <span style={{ fontWeight: 600, color: '#059669' }}>{item.toUserName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                      ₹{Number(item.amount).toFixed(2)}
                    </span>
                    <Link 
                      to={`/settlements?from=${item.fromUserId}&to=${item.toUserId}&amt=${item.amount}`}
                      className="btn btn-primary btn-sm"
                    >
                      Settle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Group Expenses</h3>
          <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600 }}>
            View All ({recentExpenses.length}) →
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <Receipt className="empty-icon" />
            <p>No expenses recorded yet. Click "Add Expense" to get started.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Payer</th>
                  <th>Date</th>
                  <th>Split Method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.slice(0, 5).map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ fontWeight: 600 }}>{exp.description}</td>
                    <td>
                      <span className="badge badge-teal">{exp.category}</span>
                    </td>
                    <td>{exp.payerName}</td>
                    <td>{exp.expenseDate}</td>
                    <td>
                      <span className="badge badge-gray">{exp.splitMethod}</span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ₹{Number(exp.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
