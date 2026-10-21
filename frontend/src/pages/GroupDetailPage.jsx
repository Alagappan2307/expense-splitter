import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, UserPlus, PlusCircle, ArrowRightLeft, Wallet, Receipt, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/apiService';
import Modal from '../components/Modal';

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addMemberError, setAddMemberError] = useState('');
  const [submittingMember, setSubmittingMember] = useState(false);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [groupData, balancesData, usersData] = await Promise.all([
        api.getGroup(id),
        api.getBalances(id).catch(() => null),
        api.getUsers()
      ]);
      setGroup(groupData);
      setBalances(balancesData);
      setAllUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setAddMemberError('Please select a user to add');
      return;
    }

    try {
      setSubmittingMember(true);
      setAddMemberError('');
      await api.addMember(id, Number(selectedUserId));
      setIsAddMemberOpen(false);
      setSelectedUserId('');
      await loadGroupDetails();
    } catch (err) {
      setAddMemberError(err.message || 'Failed to add member to group');
    } finally {
      setSubmittingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <h3>Loading group details...</h3>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="content-container">
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <h3 style={{ color: 'var(--accent-rose)' }}>Error loading group</h3>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>{error || 'Group not found'}</p>
          <Link to="/groups" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  const existingMemberIds = group.members?.map((m) => m.id) || [];
  const availableUsersToAdd = allUsers.filter((u) => !existingMemberIds.includes(u.id));

  // Build map of user balances
  const balanceMap = {};
  if (balances?.members) {
    balances.members.forEach((b) => {
      balanceMap[b.userId] = b;
    });
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 className="page-title">{group.name}</h2>
            <span className="badge badge-teal">{group.members?.length || 0} Members</span>
          </div>
          <p className="page-description">{group.description || 'No description provided'}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus size={16} /> Add Member
          </button>
          <Link to="/add-expense" className="btn btn-primary">
            <PlusCircle size={16} /> Add Expense
          </Link>
          <Link to="/simplify" className="btn btn-secondary">
            <ArrowRightLeft size={16} /> Simplify Debts
          </Link>
          <Link to="/settlements" className="btn btn-success">
            <Wallet size={16} /> Settle Debts
          </Link>
        </div>
      </div>

      {/* Group Members & Current Balances Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Group Members & Balances</h3>
          <Link to="/balances" style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
            Detailed Balance Sheet →
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Total Paid</th>
                <th>Total Share</th>
                <th>Net Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {group.members?.map((member) => {
                const bal = balanceMap[member.id];
                const net = bal ? bal.netBalance : 0;
                const status = bal ? bal.status : 'SETTLED';

                return (
                  <tr key={member.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{member.name}</strong>
                    </td>
                    <td style={{ color: '#64748b' }}>{member.email}</td>
                    <td style={{ fontWeight: 500 }}>
                      ₹{bal ? Number(bal.totalPaid).toFixed(2) : '0.00'}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      ₹{bal ? Number(bal.totalShare).toFixed(2) : '0.00'}
                    </td>
                    <td>
                      <span 
                        style={{ 
                          fontWeight: 700, 
                          color: net > 0 ? 'var(--accent-teal)' : net < 0 ? 'var(--accent-rose)' : '#64748b' 
                        }}
                      >
                        {net > 0 ? `+₹${Number(net).toFixed(2)}` : net < 0 ? `-₹${Math.abs(Number(net)).toFixed(2)}` : '₹0.00'}
                      </span>
                    </td>
                    <td>
                      {status === 'CREDITOR' && <span className="badge badge-green">Gets Back</span>}
                      {status === 'DEBTOR' && <span className="badge badge-red">Owes</span>}
                      {status === 'SETTLED' && <span className="badge badge-gray">Settled</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Member */}
      <Modal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} title={`Add Member to ${group.name}`}>
        <form onSubmit={handleAddMember}>
          {addMemberError && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {addMemberError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Person to Add</label>
            {availableUsersToAdd.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                All registered users are already members of this group! Register a new person on the Groups page.
              </p>
            ) : (
              <select 
                className="form-control" 
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                <option value="">-- Choose User --</option>
                {availableUsersToAdd.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submittingMember || availableUsersToAdd.length === 0}
            >
              {submittingMember ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
