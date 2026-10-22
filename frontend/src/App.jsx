
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import AddExpensePage from './pages/AddExpensePage';
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';
import BalancesPage from './pages/BalancesPage';
import DebtSimplificationPage from './pages/DebtSimplificationPage';
import SettlementsReportPage from './pages/SettlementsReportPage';

import { api } from './api/apiService';

export default function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback((preferredId) => {
    return api.getGroups()
      .then((data) => {
        const availableGroups = Array.isArray(data) ? data : [];
        setGroups(availableGroups);

        setSelectedGroupId((currentId) => {
          if (
            preferredId != null &&
            availableGroups.some((group) => group.id === preferredId)
          ) {
            return preferredId;
          }

          if (
            currentId != null &&
            availableGroups.some((group) => group.id === currentId)
          ) {
            return currentId;
          }

          return availableGroups.length > 0
            ? availableGroups[0].id
            : null;
        });
      })
      .catch((error) => {
        console.error('Failed to load groups:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading SettleSmart...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="main-wrapper">
        <Navbar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="/groups"
              element={
                <GroupsPage
                  onGroupCreated={(newId) => fetchGroups(newId)}
                />
              }
            />

            <Route
              path="/groups/:id"
              element={<GroupDetailPage />}
            />

            <Route
              path="/add-expense"
              element={
                <AddExpensePage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="/expenses"
              element={
                <ExpenseHistoryPage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="/balances"
              element={
                <BalancesPage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="/simplify"
              element={
                <DebtSimplificationPage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="/settlements"
              element={
                <SettlementsReportPage
                  selectedGroupId={selectedGroupId}
                  groups={groups}
                />
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}