
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Users,
  Wallet,
} from 'lucide-react';

import { api } from '../api/apiService';
import StatCard from '../components/StatCard';

export default function BalancesPage({ selectedGroupId, groups }) {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBalances = useCallback(() => {
    if (!selectedGroupId) {
      setBalanceData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .getBalances(selectedGroupId)
      .then((data) => {
        setBalanceData(data?.balances || data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load balances.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedGroupId]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const members = Array.isArray(balanceData?.members)
    ? balanceData.members
    : [];

  const formatMoney = (value) => {
    const amount = Number(value ?? 0);
    return '₹' + (Number.isFinite(amount) ? amount : 0).toFixed(2);
  };

  const creditors = members.filter(
    (member) => Number(member.netBalance ?? 0) > 0
  );

  const debtors = members.filter(
    (member) => Number(member.netBalance ?? 0) < 0
  );

  const totalReceivable = creditors.reduce(
    (sum, member) => sum + Number(member.netBalance ?? 0),
    0
  );

  const totalOwed = debtors.reduce(
    (sum, member) => sum + Math.abs(Number(member.netBalance ?? 0)),
    0
  );

  const totalNetBalance = members.reduce(
    (sum, member) => sum + Number(member.netBalance ?? 0),
    0
  );

  const settledCount = members.filter(
    (member) => Math.abs(Number(member.netBalance ?? 0)) < 0.01
  ).length;

  const selectedGroup = Array.isArray(groups)
    ? groups.find(
        (group) =>
          String(group.id ?? group.groupId) === String(selectedGroupId)
      )
    : null;

  const groupName =
    balanceData?.groupName ||
    selectedGroup?.name ||
    selectedGroup?.groupName ||
    'Selected group';

  const styles = {
    page: {
      color: 'var(--text-primary, #172b25)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    },
    heading: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    headingIcon: {
      display: 'grid',
      placeItems: 'center',
      width: '48px',
      height: '48px',
      flexShrink: 0,
      borderRadius: '14px',
      background: '#e4f3ec',
      color: '#176b55',
    },
    description: {
      margin: '0.4rem 0 0',
      color: 'var(--text-secondary, #64748b)',
      fontSize: '0.92rem',
      lineHeight: 1.6,
    },
    groupLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginTop: '0.65rem',
      padding: '0.35rem 0.65rem',
      borderRadius: '7px',
      background: '#eaf5ef',
      color: '#176b55',
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    actions: {
      display: 'flex',
      gap: '0.65rem',
      flexWrap: 'wrap',
    },
    verification: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.8rem',
      padding: '1rem 1.1rem',
      marginBottom: '1.35rem',
      border: '1px solid #cce8d8',
      borderRadius: '12px',
      background: '#f0faf4',
      color: '#245b40',
    },
    verificationWarning: {
      border: '1px solid #f3d7a2',
      background: '#fff9eb',
      color: '#8a5a12',
    },
    verificationText: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
    },
    sheet: {
      padding: 0,
      overflow: 'hidden',
      border: '1px solid var(--border-color, #e5eaf0)',
      borderRadius: '16px',
    },
    sheetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '1.25rem',
      borderBottom: '1px solid #e8edf2',
    },
    sheetTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    sheetIcon: {
      display: 'grid',
      placeItems: 'center',
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: '#f0f5f3',
      color: '#176b55',
    },
    tableWrap: {
      width: '100%',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      minWidth: '950px',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '0.9rem 1rem',
      background: '#f8fafc',
      color: '#64748b',
      fontSize: '0.72rem',
      fontWeight: 700,
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: '0.035em',
      whiteSpace: 'nowrap',
      borderBottom: '1px solid #e8edf2',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #edf1f5',
      fontSize: '0.85rem',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
    },
    member: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
    },
    avatar: {
      display: 'grid',
      placeItems: 'center',
      width: '36px',
      height: '36px',
      flexShrink: 0,
      borderRadius: '11px',
      background: '#e8f3ed',
      color: '#176b55',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.4rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 650,
    },
  };

  const getStanding = (net) => {
    if (net > 0.009) return 'creditor';
    if (net < -0.009) return 'debtor';
    return 'settled';
  };

  return (
    <div className="content-container" style={styles.page}>
      <div style={styles.header}>
        <div style={styles.heading}>
          <div style={styles.headingIcon}>
            <Scale size={25} />
          </div>

          <div>
            <h2 className="page-title">Member Balances</h2>
            <p style={styles.description}>
              Track group contributions, expense shares, and settlements.
            </p>
            <div style={styles.groupLabel}>
              <Users size={14} />
              {groupName}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadBalances}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <Link to="/simplify" className="btn btn-primary">
            <ArrowRightLeft size={16} />
            Simplify Debts
          </Link>
        </div>
      </div>

      {!loading && !error && members.length > 0 && (
        <div
          style={{
            ...styles.verification,
            ...(Math.abs(totalNetBalance) >= 0.01
              ? styles.verificationWarning
              : {}),
          }}
        >
          <div style={styles.verificationText}>
            <CheckCircle2 size={21} />
            <div>
              <strong>
                {Math.abs(totalNetBalance) < 0.01
                  ? 'Balances are reconciled'
                  : 'Balance difference detected'}
              </strong>
              <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Combined net balance: {formatMoney(totalNetBalance)}
              </div>
            </div>
          </div>

          <span
            style={{
              ...styles.badge,
              background:
                Math.abs(totalNetBalance) < 0.01 ? '#d9f4e3' : '#ffedc7',
              color:
                Math.abs(totalNetBalance) < 0.01 ? '#167345' : '#8a5a12',
            }}
          >
            {Math.abs(totalNetBalance) < 0.01
              ? 'Zero-sum verified'
              : 'Please review'}
          </span>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          label="Money to Receive"
          value={formatMoney(totalReceivable)}
          icon={TrendingUp}
          color="emerald"
          subtext={creditors.length + ' members get money back'}
        />

        <StatCard
          label="Money to Pay"
          value={formatMoney(totalOwed)}
          icon={TrendingDown}
          color="rose"
          subtext={debtors.length + ' members need to pay'}
        />

        <StatCard
          label="Group Members"
          value={members.length}
          icon={Wallet}
          color="navy"
          subtext={settledCount + ' members currently settled'}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <RefreshCw className="empty-icon" />
          <h3>Loading member balances...</h3>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>
            {error}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadBalances}
          >
            Try Again
          </button>
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <Scale className="empty-icon" />
          <h3>No balance records found</h3>
          <p>
            Select a group with balance records, or add expenses to the group.
          </p>
        </div>
      ) : (
        <div className="card" style={styles.sheet}>
          <div style={styles.sheetHeader}>
            <div style={styles.sheetTitle}>
              <div style={styles.sheetIcon}>
                <Wallet size={19} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>
                  Balance Breakdown
                </h3>
                <p style={styles.description}>
                  Member-by-member financial summary
                </p>
              </div>
            </div>

            <span
              style={{
                ...styles.badge,
                background: '#f1f5f9',
                color: '#475569',
              }}
            >
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          <div style={styles.tableWrap}>
            <table className="table" style={styles.table}>
              <thead>
                <tr>
                  {[
                    'Member',
                    'Total Paid',
                    'Expense Share',
                    'Settlements Paid',
                    'Settlements Received',
                    'Net Balance',
                    'Standing',
                  ].map((heading) => (
                    <th key={heading} style={styles.th}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {members.map((member, index) => {
                  const totalPaid = Number(member.totalPaidForExpenses ?? 0);
                  const totalShare = Number(member.totalExpenseShareOwed ?? 0);
                  const settlementsPaid = Number(
                    member.totalSettlementsPaid ?? 0
                  );
                  const settlementsReceived = Number(
                    member.totalSettlementsReceived ?? 0
                  );

                  const rawNet = Number(member.netBalance ?? 0);
                  const safeNet = Number.isFinite(rawNet) ? rawNet : 0;
                  const standing = getStanding(safeNet);

                  const initials = (member.userName || 'U')
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('');

                  const badgeColors = {
                    settled: { background: '#e7f7ed', color: '#167345' },
                    creditor: { background: '#e8f3ff', color: '#1764a0' },
                    debtor: { background: '#fff3dc', color: '#b45309' },
                  };

                  return (
                    <tr key={member.userId ?? member.id ?? index}>
                      <td style={styles.td}>
                        <div style={styles.member}>
                          <div style={styles.avatar}>{initials || 'U'}</div>
                          <strong>
                            {member.userName || 'Unknown member'}
                          </strong>
                        </div>
                      </td>

                      {[totalPaid, totalShare, settlementsPaid, settlementsReceived].map(
                        (amount, amountIndex) => (
                          <td
                            key={amountIndex}
                            style={{
                              ...styles.td,
                              color: '#334155',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {formatMoney(amount)}
                          </td>
                        )
                      )}

                      <td style={styles.td}>
                        <strong
                          style={{
                            fontVariantNumeric: 'tabular-nums',
                            color:
                              standing === 'creditor'
                                ? '#176b55'
                                : standing === 'debtor'
                                  ? '#b45309'
                                  : '#64748b',
                          }}
                        >
                          {standing === 'creditor'
                            ? '+' + formatMoney(safeNet)
                            : standing === 'debtor'
                              ? '-' + formatMoney(Math.abs(safeNet))
                              : formatMoney(0)}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...badgeColors[standing],
                          }}
                        >
                          {standing === 'creditor' ? (
                            <TrendingUp size={13} />
                          ) : standing === 'debtor' ? (
                            <TrendingDown size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}

                          {standing === 'creditor'
                            ? 'Gets back ' + formatMoney(safeNet)
                            : standing === 'debtor'
                              ? 'Owes ' + formatMoney(Math.abs(safeNet))
                              : 'Settled'}
                        </span>
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
