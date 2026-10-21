import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Wallet, AlertCircle, ArrowRightLeft, Sparkles } from 'lucide-react';
import { api } from '../api/apiService';
import Modal from '../components/Modal';

export default function DebtSimplificationPage({ selectedGroupId, groups }) {
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settlement Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [settlementNotes, setSettlementNotes] = useState('');
  const [submittingSettlement, setSubmittingSettlement] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadDebts = () => {
    if (!selectedGroupId) {
      setSimplifiedDebts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.getSimplifiedDebts(selectedGroupId)
      .then((data) => setSimplifiedDebts(data))
      .catch((err) => setError(err.message || 'Failed to simplify debts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDebts();
  }, [selectedGroupId]);

  const handleOpenSettlement = (debt) => {
    setSelectedDebt(debt);
    setSettlementNotes(`Settlement between ${debt.fromUserName} and ${debt.toUserName}`);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleConfirmSettlement = async (e) => {
    e.preventDefault();
    if (!selectedDebt || !selectedGroupId) return;

    try {
      setSubmittingSettlement(true);
      setModalError('');
      await api.recordSettlement({
        groupId: Number(selectedGroupId),
        fromUserId: selectedDebt.fromUserId,
        toUserId: selectedDebt.toUserId,
        amount: Number(selectedDebt.amount),
        notes: settlementNotes,
      });

      setIsModalOpen(false);
      setSelectedDebt(null);
      loadDebts(); // Refresh simplified debts
    } catch (err) {
      setModalError(err.message || 'Failed to record settlement');
    } finally {
      setSubmittingSettlement(false);
    }
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 className="page-title">Debt Simplification Algorithm</h2>
            <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={12} /> Greedy Min-Cash-Flow
            </span>
          </div>
          <p className="page-description">
            Minimizes total payment transactions using optimal graph reduction, eliminating circular debts.
          </p>
        </div>
        <Link to="/settlements" className="btn btn-secondary">
          <Wallet size={16} /> Settlement History
        </Link>
      </div>

      {/* Algorithm Explainer Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', marginBottom: '1.5rem', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: 'var(--accent-teal)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.4rem 0', color: 'white', fontSize: '1.15rem' }}>
              Minimum Cash Flow Optimization
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
              In a group of <em>N</em> people, traditional peer-to-peer debts can require up to <strong>N(N - 1) / 2</strong> separate transactions. 
              Our greedy settlement engine matches the largest debtor with the largest creditor at each step, mathematically guaranteeing 
              at most <strong>(N - 1)</strong> total transactions to clear all obligations.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Calculating optimal payment paths...</h3>
        </div>
      ) : error ? (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</p>
        </div>
      ) : simplifiedDebts.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 className="empty-icon" style={{ color: 'var(--accent-teal)' }} />
          <h3>All Debts Fully Settled!</h3>
          <p>Every member in this group is currently square. No pending payments are required.</p>
          <Link to="/add-expense" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Add New Expense
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>
              Recommended Settlements ({simplifiedDebts.length} Transactions Needed)
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Total Settlement Pool: <strong>₹{simplifiedDebts.reduce((s, d) => s + Number(d.amount), 0).toFixed(2)}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {simplifiedDebts.map((debt, index) => (
              <div 
                key={index} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1.25rem',
                  borderLeft: '4px solid var(--accent-teal)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                {/* Visual Transaction Flow: Debtor -> Amount -> Creditor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 280 }}>
                  <div style={{ minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Payer (Debtor)</div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{debt.fromUserName}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: 220 }}>
                    <div style={{ height: 2, flex: 1, background: '#cbd5e1' }} />
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.35rem 0.75rem', borderRadius: '20px', textAlign: 'center' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                        ₹{Number(debt.amount).toFixed(2)}
                      </span>
                    </div>
                    <ArrowRight size={18} color="var(--accent-teal)" />
                  </div>

                  <div style={{ minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Receiver (Creditor)</div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{debt.toUserName}</strong>
                  </div>
                </div>

                {/* Settle Action Button */}
                <button 
                  className="btn btn-success" 
                  onClick={() => handleOpenSettlement(debt)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Wallet size={16} /> Settle Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settlement Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Record Debt Settlement"
      >
        {selectedDebt && (
          <form onSubmit={handleConfirmSettlement}>
            {modalError && (
              <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {modalError}
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Debtor (Sender):</span>
                <strong style={{ color: '#0f172a' }}>{selectedDebt.fromUserName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Creditor (Receiver):</span>
                <strong style={{ color: '#0f172a' }}>{selectedDebt.toUserName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Amount to Settle:</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--accent-teal)' }}>
                  ₹{Number(selectedDebt.amount).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Notes (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                value={settlementNotes}
                onChange={(e) => setSettlementNotes(e.target.value)}
                placeholder="e.g. GPay UPI transfer, Cash, Bank transfer"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={submittingSettlement}>
                {submittingSettlement ? 'Recording...' : 'Confirm Settlement'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
