import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import DotGrid from './components/common/DotGrid';
function DashboardRouter() {
  const { currentUser } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
      
      <div className="rounded-3xl border border-white/20 bg-white/[0.06] backdrop-blur-3xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]">
        {currentUser.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
      </div>
    </main>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden">

        <div className="fixed inset-0 w-full h-full, position: 'relative'">

          

         <DotGrid
    dotSize={5}
    gap={15}
    baseColor="#2F293A"
    activeColor="#5227FF"
    proximity={120}
    shockRadius={250}
    shockStrength={5}
    resistance={750}
    returnDuration={1.5}
  />
        </div>

        {/* Frosted Glass Navigation Bar with User Switcher */}
        <Navbar />

        {/* Dynamic Role-Based View */}
        <div className="flex-1">
          <DashboardRouter />
        </div>

        {/* Global Feedback Notifications */}
        <Toast />

        {/* Frosted Glass Footer */}
        <footer className="border-t border-white/15 bg-white/[0.08] backdrop-blur-2xl py-4 text-center text-xs text-white/70 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CourseDesk Student-Assignment Management System</span>
            <span>Learning Management System</span>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
