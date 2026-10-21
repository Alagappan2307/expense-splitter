import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, PlusCircle, BarChart3, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="top-navbar">
      <div className="nav-brand-container">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Menu">
          <Menu size={22} />
        </button>
        <div className="brand-title-group">
          <div className="brand-icon">
            <Headphones size={22} color="#3b82f6" />
          </div>
          <div>
            <h1 className="brand-name">Helpdesk Management System</h1>
            <p className="brand-subtitle">Create, track, and manage technical support tickets</p>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        <Link to="/create" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>Create Ticket</span>
        </Link>
        <Link to="/report" className="btn btn-secondary btn-sm">
          <BarChart3 size={16} />
          <span>Admin Report</span>
        </Link>
      </div>
    </header>
  );
}
