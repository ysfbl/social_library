import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import movie1 from '../assets/movie1.jpg';
import movie2 from '../assets/movie2.jpg';
import library1 from '../assets/library1.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      toast.success('Giriş başarılı! Hoş geldiniz.');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Giriş başarısız';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Şifre sıfırlama linki backend konsolunda görüntülendi!');
        setShowForgotPassword(false);
        setForgotEmail('');
      } else {
        toast.error(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bağlantı hatası. Backend çalışıyor mu kontrol edin.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-red-950 relative overflow-hidden">
      {/* Animated Background Images */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-3 opacity-10">
          <img src={movie1} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '4s' }} />
          <img src={library1} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '5s' }} />
          <img src={movie2} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-red-950/50 to-black/90 backdrop-blur-sm"></div>

        {/* Floating Circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
      </div>

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-red-600/10 rounded-2xl mb-4 backdrop-blur-sm border border-red-600/20">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-red-500 text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
            SOSYAL KÜTÜPHANE
          </h1>
          <p className="text-gray-400 text-sm">Film ve kitaplarınızı keşfedin, paylaşın</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          {!showForgotPassword ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-red-500">●</span> Giriş Yap
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Şifre
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium"
                    >
                      Şifremi Unuttum
                    </button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-sm text-gray-500">veya</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Hesabınız yok mu?{' '}
                  <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
                    Kayıt Ol
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-red-500">●</span> Şifremi Unuttum
                </h2>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                E-posta adresinizi girin, şifre sıfırlama linki backend konsolunda görüntülenecektir.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                    placeholder="ornek@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/50"
                >
                  {forgotLoading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Geri Dön
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-xs">
            © 2025 Sosyal Kütüphane. Tüm hakları saklıdır.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
