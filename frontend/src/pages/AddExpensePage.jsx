import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Check, AlertCircle, Calculator, Users } from 'lucide-react';
import { api } from '../api/apiService';

const CATEGORIES = [
  'Food & Dining',
  'Travel & Transit',
  'Accommodation',
  'Entertainment',
  'Groceries',
  'Utilities',
  'Shopping',
  'Other'
];

export default function AddExpensePage({ selectedGroupId, groups }) {
  const navigate = useNavigate();

  const [activeGroupId, setActiveGroupId] = useState(selectedGroupId || '');
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Form Fields
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState('');
  const [splitMethod, setSplitMethod] = useState('EQUAL');

  // Selected participant IDs
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Custom and Percentage inputs: { [userId]: string/number }
  const [percentages, setPercentages] = useState({});
  const [customAmounts, setCustomAmounts] = useState({});

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync activeGroupId when selectedGroupId prop changes
  useEffect(() => {
    if (selectedGroupId && !activeGroupId) {
      setActiveGroupId(selectedGroupId);
    }
  }, [selectedGroupId]);

  // Load group members when activeGroupId changes
  useEffect(() => {
    if (!activeGroupId) {
      setMembers([]);
      setSelectedParticipants([]);
      setPayerId('');
      return;
    }

    setLoadingMembers(true);
    api.getGroupMembers(activeGroupId)
      .then((data) => {
        setMembers(data);
        const allIds = data.map((m) => m.id);
        setSelectedParticipants(allIds);
        if (data.length > 0) {
          setPayerId(data[0].id.toString());
        }
      })
      .catch((err) => {
        setFormError('Failed to load group members: ' + err.message);
      })
      .finally(() => setLoadingMembers(false));
  }, [activeGroupId]);

  // Participant checkbox toggles
  const handleToggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllParticipants = () => {
    if (selectedParticipants.length === members.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(members.map((m) => m.id));
    }
  };

  // Calculations for preview
  const numAmount = parseFloat(amount) || 0;
  const numParticipants = selectedParticipants.length;

  // Validate split inputs
  const calculateTotalAllocated = () => {
    if (splitMethod === 'EQUAL') {
      return numAmount;
    }
    if (splitMethod === 'PERCENTAGE') {
      return selectedParticipants.reduce((sum, id) => sum + (parseFloat(percentages[id]) || 0), 0);
    }
    if (splitMethod === 'CUSTOM') {
      return selectedParticipants.reduce((sum, id) => sum + (parseFloat(customAmounts[id]) || 0), 0);
    }
    return 0;
  };

  const totalAllocated = calculateTotalAllocated();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!activeGroupId) {
      setFormError('Please select a group');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter an expense description');
      return;
    }
    if (!amount || numAmount <= 0) {
      setFormError('Amount must be greater than 0');
      return;
    }
    if (!payerId) {
      setFormError('Please select who paid for the expense');
      return;
    }
    if (selectedParticipants.length === 0) {
      setFormError('Please select at least one participant');
      return;
    }

    // Split specific validations
    if (splitMethod === 'PERCENTAGE') {
      if (Math.abs(totalAllocated - 100) > 0.05) {
        setFormError(`Total percentage must equal 100%. Current sum: ${totalAllocated.toFixed(2)}%`);
        return;
      }
    } else if (splitMethod === 'CUSTOM') {
      if (Math.abs(totalAllocated - numAmount) > 0.05) {
        setFormError(`Custom shares sum (₹${totalAllocated.toFixed(2)}) must equal total amount (₹${numAmount.toFixed(2)})`);
        return;
      }
    }

    // Build participants payload
    const participantsPayload = selectedParticipants.map((userId) => {
      const item = { userId };
      if (splitMethod === 'PERCENTAGE') {
        item.percentage = parseFloat(percentages[userId]) || 0;
      } else if (splitMethod === 'CUSTOM') {
        item.customAmount = parseFloat(customAmounts[userId]) || 0;
      }
      return item;
    });

    const payload = {
      groupId: Number(activeGroupId),
      payerId: Number(payerId),
      description: description.trim(),
      category,
      amount: numAmount,
      expenseDate,
      splitMethod,
      participants: participantsPayload,
    };

    try {
      setSubmitting(true);
      await api.createExpense(payload);
      navigate('/expenses');
    } catch (err) {
      setFormError(err.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Add New Expense</h2>
          <p className="page-description">
            Split expenses equally, by percentage, or by custom exact amounts across group members.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {formError && (
          <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)', marginBottom: '1.5rem', background: '#fff1f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#be123c' }}>
              <AlertCircle size={20} />
              <strong style={{ fontSize: '0.95rem' }}>{formError}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          {/* Group & Payer selection row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Group *</label>
              <select 
                className="form-control" 
                value={activeGroupId} 
                onChange={(e) => setActiveGroupId(e.target.value)}
                required
              >
                <option value="">-- Select Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Paid By *</label>
              <select 
                className="form-control" 
                value={payerId} 
                onChange={(e) => setPayerId(e.target.value)}
                required
                disabled={loadingMembers || members.length === 0}
              >
                {members.length === 0 && <option value="">No members in group</option>}
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Dinner, Fuel, Grocery Bill"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select 
                className="form-control" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
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

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Date *</label>
              <input 
                type="date" 
                className="form-control" 
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Split Method Tabs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Split Method *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${splitMethod === 'EQUAL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => setSplitMethod('EQUAL')}
              >
                Equal Split (=)
              </button>
              <button
                type="button"
                className={`btn ${splitMethod === 'PERCENTAGE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => setSplitMethod('PERCENTAGE')}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                className={`btn ${splitMethod === 'CUSTOM' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => setSplitMethod('CUSTOM')}
              >
                Custom Amounts (₹)
              </button>
            </div>
          </div>

          {/* Participants Split Configuration Table */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Participants ({selectedParticipants.length} selected)
              </label>
              {members.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllParticipants}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {selectedParticipants.length === members.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {members.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Please select a group with members to configure the split.</p>
            ) : (
              <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Include</th>
                      <th>Member</th>
                      {splitMethod === 'PERCENTAGE' && <th>Percentage (%)</th>}
                      {splitMethod === 'CUSTOM' && <th>Custom Share (₹)</th>}
                      <th>Calculated Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => {
                      const isSelected = selectedParticipants.includes(member.id);
                      let computedShare = 0;

                      if (isSelected) {
                        if (splitMethod === 'EQUAL') {
                          computedShare = numParticipants > 0 ? numAmount / numParticipants : 0;
                        } else if (splitMethod === 'PERCENTAGE') {
                          const pct = parseFloat(percentages[member.id]) || 0;
                          computedShare = (numAmount * pct) / 100;
                        } else if (splitMethod === 'CUSTOM') {
                          computedShare = parseFloat(customAmounts[member.id]) || 0;
                        }
                      }

                      return (
                        <tr key={member.id} style={{ opacity: isSelected ? 1 : 0.5 }}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleParticipant(member.id)}
                            />
                          </td>
                          <td>
                            <strong>{member.name}</strong>
                          </td>
                          {splitMethod === 'PERCENTAGE' && (
                            <td>
                              <input 
                                type="number" 
                                step="0.1" 
                                min="0" 
                                max="100"
                                placeholder="0%" 
                                className="form-control"
                                style={{ width: '110px', padding: '0.4rem 0.6rem' }}
                                disabled={!isSelected}
                                value={percentages[member.id] || ''}
                                onChange={(e) => setPercentages({ ...percentages, [member.id]: e.target.value })}
                              />
                            </td>
                          )}
                          {splitMethod === 'CUSTOM' && (
                            <td>
                              <input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                placeholder="₹0.00" 
                                className="form-control"
                                style={{ width: '130px', padding: '0.4rem 0.6rem' }}
                                disabled={!isSelected}
                                value={customAmounts[member.id] || ''}
                                onChange={(e) => setCustomAmounts({ ...customAmounts, [member.id]: e.target.value })}
                              />
                            </td>
                          )}
                          <td>
                            <strong style={{ color: isSelected ? 'var(--primary-dark)' : '#94a3b8' }}>
                              ₹{computedShare.toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Split Status Bar */}
            {splitMethod === 'PERCENTAGE' && (
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Sum of Percentages: <strong>{totalAllocated.toFixed(2)}%</strong> / 100%</span>
                <span style={{ color: Math.abs(totalAllocated - 100) < 0.01 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {Math.abs(totalAllocated - 100) < 0.01 ? '✓ Exactly 100%' : `Diff: ${(100 - totalAllocated).toFixed(2)}%`}
                </span>
              </div>
            )}

            {splitMethod === 'CUSTOM' && (
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Sum of Shares: <strong>₹{totalAllocated.toFixed(2)}</strong> / ₹{numAmount.toFixed(2)}</span>
                <span style={{ color: Math.abs(totalAllocated - numAmount) < 0.01 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {Math.abs(totalAllocated - numAmount) < 0.01 ? '✓ Matches Total' : `Diff: ₹${(numAmount - totalAllocated).toFixed(2)}`}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || members.length === 0}>
              <Receipt size={16} /> {submitting ? 'Recording Expense...' : 'Record & Split Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
