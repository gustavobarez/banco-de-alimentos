import React from 'react';
import { LayoutDashboard, Users, Building2, Package, History, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userName?: string;
  onLogout?: () => void;
}

export function Layout({ children, userName = 'Usuário', onLogout }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Doadores', path: '/doadores' },
    { icon: Building2, label: 'Instituições', path: '/instituicoes' },
    { icon: Package, label: 'Estoque', path: '/estoque' },
    { icon: History, label: 'Histórico', path: '/historico' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-md fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-[#2E7D32]">Banco de Alimentos</h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-[#424242] hover:text-[#2E7D32]"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-[#A5D6A7] text-[#2E7D32]'
                    : 'text-[#424242] hover:bg-[#F5F5F5]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-[#424242] hover:text-[#2E7D32]"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 lg:flex-none"></div>
          <div className="flex items-center gap-4">
            <span className="text-[#424242] text-sm lg:text-base">{userName}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 lg:px-4 rounded-lg bg-[#F5F5F5] hover:bg-gray-200 transition-colors text-[#424242]"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center p-4 text-[#424242] text-sm border-t border-gray-200 bg-white">
          <p>Banco de Alimentos © 2025</p>
        </footer>
      </div>
    </div>
  );
}
