import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, PlusCircle, Search, Filter, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../api/apiService';

export default function ExpenseHistoryPage({ selectedGroupId, groups }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  useEffect(() => {
    if (!selectedGroupId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.getExpenses(selectedGroupId)
      .then((data) => setExpenses(data))
      .catch((err) => setError(err.message || 'Failed to load expenses'))
      .finally(() => setLoading(false));
  }, [selectedGroupId]);

  const toggleExpand = (id) => {
    setExpandedExpenseId((prev) => (prev === id ? null : id));
  };

  const categories = ['ALL', ...new Set(expenses.map((e) => e.category).filter(Boolean))];

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.payerName && e.payerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Expense History</h2>
          <p className="page-description">
            Complete audit trail of all transactions, payer details, and individual participant shares.
          </p>
        </div>
        <Link to="/add-expense" className="btn btn-primary">
          <PlusCircle size={16} /> Add Expense
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text"
                placeholder="Search by description or payer..."
                className="form-control"
                style={{ paddingLeft: '2.2rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-control" 
              style={{ width: 'auto', minWidth: '150px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
            Showing <strong>{filteredExpenses.length}</strong> expenses • Total: <strong style={{ color: 'var(--primary-dark)' }}>₹{totalFilteredAmount.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading expenses...</h3>
        </div>
      ) : error ? (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <Receipt className="empty-icon" />
          <h3>No expenses found</h3>
          <p>{expenses.length === 0 ? 'No expenses have been recorded for this group yet.' : 'No expenses match your search/filter criteria.'}</p>
          <Link to="/add-expense" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <PlusCircle size={16} /> Add First Expense
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredExpenses.map((exp) => {
            const isExpanded = expandedExpenseId === exp.id;
            return (
              <div 
                key={exp.id} 
                className="card" 
                style={{ padding: '1.25rem', transition: 'box-shadow 0.2s ease', borderLeft: '4px solid var(--accent-teal)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{exp.description}</h3>
                      <span className="badge badge-teal">{exp.category}</span>
                      <span className="badge badge-gray">{exp.splitMethod}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={14} /> Paid by <strong style={{ color: '#1e293b' }}>{exp.payerName}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {exp.expenseDate}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
                        ₹{Number(exp.amount).toFixed(2)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {exp.shares?.length || 0} participants
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleExpand(exp.id)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                      title="View Breakdown"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Shares Breakdown */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      Split Breakdown
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {exp.shares?.map((share, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            background: '#f8fafc', 
                            padding: '0.5rem 0.75rem', 
                            borderRadius: '6px', 
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
                            {share.userName}
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                            ₹{Number(share.shareAmount).toFixed(2)}
                            {share.percentage ? ` (${Number(share.percentage).toFixed(1)}%)` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
