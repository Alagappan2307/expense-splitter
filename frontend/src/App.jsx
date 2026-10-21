import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

  const fetchGroups = (preferredId) => {
    return api.getGroups()
      .then((data) => {
        setGroups(data);
        if (data.length > 0) {
          if (preferredId && data.some((g) => g.id === preferredId)) {
            setSelectedGroupId(preferredId);
          } else if (!selectedGroupId) {
            setSelectedGroupId(data[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load initial groups:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="main-wrapper">
          <Navbar 
            groups={groups} 
            selectedGroupId={selectedGroupId} 
            onSelectGroup={(id) => setSelectedGroupId(id)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />

          <main style={{ flex: 1, minHeight: 'calc(100vh - 68px)' }}>
            <Routes>
              <Route 
                path="/" 
                element={<DashboardPage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route 
                path="/groups" 
                element={<GroupsPage onGroupCreated={(newId) => fetchGroups(newId)} />} 
              />
              <Route 
                path="/groups/:id" 
                element={<GroupDetailPage />} 
              />
              <Route 
                path="/add-expense" 
                element={<AddExpensePage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route 
                path="/expenses" 
                element={<ExpenseHistoryPage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route 
                path="/balances" 
                element={<BalancesPage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route 
                path="/simplify" 
                element={<DebtSimplificationPage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route 
                path="/settlements" 
                element={<SettlementsReportPage selectedGroupId={selectedGroupId} groups={groups} />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
