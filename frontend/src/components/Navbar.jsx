
import React from 'react';
import { Link } from 'react-router-dom';
import {
  WalletCards,
  PlusCircle,
  Users,
  Menu,
} from 'lucide-react';

export default function Navbar({
  groups = [],
  selectedGroupId,
  onSelectGroup,
  onToggleSidebar,
}) {
  return (
    <header className="top-navbar">
      <div className="group-selector-wrap">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div className="brand-icon">
          <WalletCards size={22} />
        </div>

        <div>
          <h1 className="brand-name">SettleSmart</h1>
          <p className="brand-subtitle">
            Intelligent Expense Settlement System
          </p>
        </div>
      </div>

      <div className="nav-actions">
        <select
          className="group-select"
          aria-label="Select expense group"
          value={selectedGroupId ?? ''}
          onChange={(event) =>
            onSelectGroup(
              event.target.value === ''
                ? null
                : Number(event.target.value)
            )
          }
        >
          <option value="">Select group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <Link to="/groups" className="btn btn-secondary btn-sm">
          <Users size={16} />
          <span>Groups</span>
        </Link>

        <Link to="/add-expense" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </Link>
      </div>
    </header>
  );
}
