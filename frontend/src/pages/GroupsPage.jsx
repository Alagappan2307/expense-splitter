import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, UserPlus, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { api } from '../api/apiService';
import Modal from '../components/Modal';

export default function GroupsPage({ onGroupCreated }) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Group Form state
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupFormError, setGroupFormError] = useState('');
  const [submittingGroup, setSubmittingGroup] = useState(false);

  // User Form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userFormError, setUserFormError] = useState('');
  const [submittingUser, setSubmittingUser] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [groupsData, usersData] = await Promise.all([
        api.getGroups(),
        api.getUsers()
      ]);
      setGroups(groupsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to load groups data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserSelection = (userId) => {
    setSelectedUserIds((prev) => 
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setGroupFormError('Group name is required');
      return;
    }
    if (selectedUserIds.length < 2) {
      setGroupFormError('Please select at least 2 members for this group');
      return;
    }

    try {
      setSubmittingGroup(true);
      setGroupFormError('');
      const newGroup = await api.createGroup({
        name: groupName.trim(),
        description: groupDesc.trim(),
        memberUserIds: selectedUserIds,
      });

      setIsGroupModalOpen(false);
      setGroupName('');
      setGroupDesc('');
      setSelectedUserIds([]);
      await loadData();
      if (onGroupCreated) onGroupCreated(newGroup.id);
      navigate(`/groups/${newGroup.id}`);
    } catch (err) {
      setGroupFormError(err.message || 'Error creating group');
    } finally {
      setSubmittingGroup(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      setUserFormError('Name and email are required');
      return;
    }

    try {
      setSubmittingUser(true);
      setUserFormError('');
      const newUser = await api.createUser({
        name: userName.trim(),
        email: userEmail.trim(),
      });

      setIsUserModalOpen(false);
      setUserName('');
      setUserEmail('');
      // Automatically add new user to selected members if group modal is in progress
      setSelectedUserIds((prev) => [...prev, newUser.id]);
      await loadData();
    } catch (err) {
      setUserFormError(err.message || 'Error registering user');
    } finally {
      setSubmittingUser(false);
    }
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Groups Management</h2>
          <p className="page-description">
            Create groups, invite members, and track shared balances with automatic debt simplification.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsUserModalOpen(true)}>
            <UserPlus size={16} /> Register Member
          </button>
          <button className="btn btn-primary" onClick={() => setIsGroupModalOpen(true)}>
            <Plus size={16} /> Create New Group
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <h3>Loading groups...</h3>
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-icon" />
          <h3>No groups found</h3>
          <p>Create your first group to start splitting bills and expenses with friends!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setIsGroupModalOpen(true)}>
            <Plus size={16} /> Create Group
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {groups.map((group) => (
            <div key={group.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>{group.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="badge badge-teal">{group.members?.length || 0} Members</span>
                </div>

                <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.25rem', minHeight: '40px' }}>
                  {group.description || 'No description provided.'}
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Members
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {group.members?.map((m) => (
                      <span key={m.id} className="badge badge-gray">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/groups/${group.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  View Group & Balances <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Group */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="Create New Group">
        <form onSubmit={handleCreateGroup}>
          {groupFormError && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {groupFormError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Group Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Goa Trip, Flat 402, Hackathon Team" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Weekend vacation travel expenses" 
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Select Members ({selectedUserIds.length} chosen) *</label>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => setIsUserModalOpen(true)}
              >
                + New Person
              </button>
            </div>
            
            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem' }}>
              {users.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem' }}>No users available. Click "+ New Person" to create one.</p>
              ) : (
                users.map((u) => {
                  const isChecked = selectedUserIds.includes(u.id);
                  return (
                    <label 
                      key={u.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0.4rem 0.6rem', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => handleToggleUserSelection(u.id)} 
                        />
                        <span style={{ fontWeight: 500, color: '#1e293b' }}>{u.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsGroupModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingGroup}>
              {submittingGroup ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Register User */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Register New Person">
        <form onSubmit={handleCreateUser}>
          {userFormError && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {userFormError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Alagappan" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. alagappan@example.com" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submittingUser}>
              {submittingUser ? 'Registering...' : 'Register Person'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
