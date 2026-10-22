
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Receipt,
  Wallet,
  ArrowRightLeft,
  BarChart3,
  X,
  WalletCards,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/groups', label: 'Expense Groups', icon: Users },
    { to: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { to: '/expenses', label: 'Expense History', icon: Receipt },
    { to: '/balances', label: 'Member Balances', icon: Wallet },
    { to: '/simplify', label: 'Simplify Debts', icon: ArrowRightLeft },
    { to: '/settlements', label: 'Settlements Report', icon: BarChart3 },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge">
            <WalletCards size={20} />
            <span>SETTLESMART</span>
          </div>

          <h2 className="app-title">Intelligent Settlement System</h2>
          <p className="app-subtitle">
            Smart expense splitting and debt settlement
          </p>

          <button
            type="button"
            className="close-sidebar-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="student-badge">
            <div>Expense tracking enabled</div>
            <small>SettleSmart v1.0.0</small>
          </div>
        </div>
      </aside>
    </>
  );
}
