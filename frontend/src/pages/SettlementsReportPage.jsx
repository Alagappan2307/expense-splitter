import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, CheckCircle2, PlusCircle, Calendar, ArrowRight, Printer, FileText } from 'lucide-react';
import { api } from '../api/apiService';
import Modal from '../components/Modal';

export default function SettlementsReportPage({ selectedGroupId, groups }) {
  const [settlements, setSettlements] = useState([]);
  const [report, setReport] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Manual Settlement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!selectedGroupId) {
      setSettlements([]);
      setReport(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [settlementsData, reportData, membersData] = await Promise.all([
        api.getSettlements(selectedGroupId),
        api.getGroupReport(selectedGroupId),
        api.getGroupMembers(selectedGroupId)
      ]);
      setSettlements(settlementsData);
      setReport(reportData);
      setMembers(membersData);
    } catch (err) {
      setError(err.message || 'Failed to load settlements data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGroupId]);

  const handleCreateSettlement = async (e) => {
    e.preventDefault();
    if (!fromUserId || !toUserId) {
      setModalError('Please select both sender and receiver');
      return;
    }
    if (fromUserId === toUserId) {
      setModalError('Sender and receiver cannot be the same person');
      return;
    }
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setModalError('Amount must be greater than zero');
      return;
    }

    try {
      setSubmitting(true);
      setModalError('');
      await api.recordSettlement({
        groupId: Number(selectedGroupId),
        fromUserId: Number(fromUserId),
        toUserId: Number(toUserId),
        amount: numAmount,
        notes: notes.trim(),
      });

      setIsModalOpen(false);
      setFromUserId('');
      setToUserId('');
      setAmount('');
      setNotes('');
      await loadData();
    } catch (err) {
      setModalError(err.message || 'Error recording settlement');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settlement Status & Final Report</h2>
          <p className="page-description">
            Audit log of all settled debt transfers and college presentation summary report.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={16} /> Record Settlement
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading settlement report...</h3>
        </div>
      ) : error ? (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</p>
        </div>
      ) : (
        <div>
          {/* Executive Summary Card */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <FileText size={20} color="var(--primary-dark)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                Group Financial Summary: {report?.group?.name}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Expenses Recorded
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                  ₹{Number(report?.totalExpenseAmount || 0).toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Across {report?.totalExpensesCount || 0} bills
                </span>
              </div>

              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Settled to Date
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-teal)', marginTop: '0.25rem' }}>
                  ₹{Number(report?.totalSettlementAmount || 0).toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {settlements.length} payments recorded
                </span>
              </div>

              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Remaining Unsettled Pool
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: report?.simplifiedDebts?.length === 0 ? '#16a34a' : 'var(--accent-rose)', marginTop: '0.25rem' }}>
                  ₹{(report?.simplifiedDebts?.reduce((s, d) => s + Number(d.amount), 0) || 0).toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {report?.simplifiedDebts?.length || 0} simplified steps remaining
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Audit History Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>
              Settlement Payment History
            </h3>

            {settlements.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Wallet className="empty-icon" />
                <p>No settlement payments have been recorded yet.</p>
                <Link to="/simplify" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                  View Pending Debts
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Payer (From)</th>
                      <th>Receiver (To)</th>
                      <th>Amount Paid</th>
                      <th>Date & Time</th>
                      <th>Notes / Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((s) => (
                      <tr key={s.id}>
                        <td style={{ color: '#64748b', fontFamily: 'monospace' }}>
                          #SET-{s.id}
                        </td>
                        <td>
                          <strong style={{ color: '#0f172a' }}>{s.fromUserName}</strong>
                        </td>
                        <td>
                          <strong style={{ color: '#0f172a' }}>{s.toUserName}</strong>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--accent-teal)', fontSize: '1rem' }}>
                            ₹{Number(s.amount).toFixed(2)}
                          </strong>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {new Date(s.settledAt).toLocaleString()}
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                          {s.notes || '—'}
                        </td>
                        <td>
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle2 size={12} /> Settled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Record Settlement */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Manual Settlement">
        <form onSubmit={handleCreateSettlement}>
          {modalError && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {modalError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Payer (Who paid?) *</label>
            <select 
              className="form-control" 
              value={fromUserId} 
              onChange={(e) => setFromUserId(e.target.value)}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Receiver (Who was paid?) *</label>
            <select 
              className="form-control" 
              value={toUserId} 
              onChange={(e) => setToUserId(e.target.value)}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id} disabled={String(m.id) === String(fromUserId)}>
                  {m.name} {String(m.id) === String(fromUserId) ? '(Cannot pay self)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01" 
              className="form-control" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method / Note</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. UPI Google Pay, PhonePe, Cash" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
