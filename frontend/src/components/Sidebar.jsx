import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, RefreshCw, Table, BarChart3, X, LifeBuoy } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/create', label: 'Create New Ticket', icon: PlusCircle },
    { to: '/update-status', label: 'Update Latest Status', icon: RefreshCw },
    { to: '/tickets', label: 'View All Tickets', icon: Table },
    { to: '/report', label: 'Admin Report', icon: BarChart3 },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LifeBuoy size={24} color="#3b82f6" />
            <span>Helpdesk Hub</span>
          </div>
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">CORE MODULES</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} className="nav-item-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system-badge">
            <span className="status-indicator online" />
            <span>MySQL Connected</span>
          </div>
          <small className="system-version">v1.0.0 Production</small>
        </div>
      </aside>
    </>
  );
}
