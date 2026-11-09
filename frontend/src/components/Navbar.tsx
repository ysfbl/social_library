import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from './ConfirmModal';
import Avatar from './Avatar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Başarıyla çıkış yapıldı');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-red-600 text-2xl font-bold tracking-tight hover:text-red-500 transition-colors"
            >
              SOSYAL KÜTÜPHANE
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => navigate('/search')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/search')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Keşfet
              </button>
              <button
                onClick={() => navigate(`/profile/${user?.id}`)}
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/profile')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Profilim
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/profile/${user?.id}`)}
              className="hidden md:flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Avatar
                avatar_id={(user as any)?.avatar_id}
                username={user?.username || ''}
                size="sm"
                className="w-8 h-8 text-xs"
              />
              <span className="text-sm text-gray-300">{user?.username}</span>
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-800">
          <Avatar
            avatar_id={(user as any)?.avatar_id}
            username={user?.username || ''}
            size="sm"
            className="w-8 h-8 text-xs"
          />
          <span className="text-sm text-gray-300">{user?.username}</span>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`text-sm font-medium text-left py-2 ${
              isActive('/') ? 'text-white' : 'text-gray-300'
            }`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => navigate('/search')}
            className={`text-sm font-medium text-left py-2 ${
              isActive('/search') ? 'text-white' : 'text-gray-300'
            }`}
          >
            Keşfet
          </button>
          <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className={`text-sm font-medium text-left py-2 ${
              location.pathname.startsWith('/profile') ? 'text-white' : 'text-gray-300'
            }`}
          >
            Profilim
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Çıkış Yap"
        message="Çıkış yapmak istediğinize emin misiniz?"
        confirmText="Çıkış Yap"
        cancelText="İptal"
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
        isDangerous
      />
    </nav>
  );
};

export default Navbar;
