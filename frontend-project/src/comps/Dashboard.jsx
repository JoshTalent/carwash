import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paperclip,
  Car,
  Coins,
  PawPrint,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

import ServiceRecords from './ServiceRecords';
import CarRegistrationForm from './Cars';
import ServiceManagement from './Service';
import PaymentForm from './Moneny';
import ServiceDashboard from './Report';

const Dashboard = () => {
  const [viewPage, setViewPage] = useState("dash");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('uname');
    window.location.href = "/";
  };

  const tabs = [
    { id: "car", label: "Cars", icon: <Car size={18} /> },
    { id: "serv", label: "Services", icon: <Paperclip size={18} /> },
    { id: "reco", label: "Packages", icon: <PawPrint size={18} /> },
    { id: "pay", label: "Payments", icon: <Coins size={18} /> },
    { id: "dash", label: "Report", icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold tracking-tight">CWSMS</div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setViewPage(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ease-in-out ${
                    viewPage === tab.id
                      ? "bg-white text-blue-900 font-semibold shadow-md"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white hover:text-blue-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 ease-in-out font-semibold shadow-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewPage(tab.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ease-in-out ${
                  viewPage === tab.id
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 ease-in-out font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {viewPage === "dash" && <ServiceDashboard />}
          {viewPage === "reco" && <ServiceRecords />}
          {viewPage === "car" && <CarRegistrationForm />}
          {viewPage === "serv" && <ServiceManagement />}
          {viewPage === "pay" && <PaymentForm />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
