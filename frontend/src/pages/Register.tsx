import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { avatarOptions, getDefaultAvatar } from '../utils/avatars';
import library2 from '../assets/library2.jpg';
import library3 from '../assets/library3.jpg';
import movie3 from '../assets/movie3.jpg';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    avatar_id: getDefaultAvatar().id,
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      const errorMessage = 'Şifreler eşleşmiyor';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Kayıt başarısız';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-indigo-950 relative overflow-hidden py-12">
      {/* Animated Background Images */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-3 opacity-10">
          <img src={library2} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '5s' }} />
          <img src={movie3} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '6s' }} />
          <img src={library3} alt="" className="w-full h-full object-cover animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-purple-950/50 to-black/90 backdrop-blur-sm"></div>

        {/* Floating Circles */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
      </div>

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-600/10 rounded-2xl mb-4 backdrop-blur-sm border border-purple-600/20">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-purple-500 text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            SOSYAL KÜTÜPHANE
          </h1>
          <p className="text-gray-400 text-sm">Film ve kitaplarınızı keşfedin, paylaşın</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple-500">●</span> Kayıt Ol
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                placeholder="kullaniciadi"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Avatar Seç
              </label>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-white/5">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar_id: avatar.id })}
                    className={`aspect-square rounded-xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                      formData.avatar_id === avatar.id
                        ? 'ring-4 ring-purple-500 ring-offset-2 ring-offset-transparent scale-110 shadow-lg shadow-purple-500/50'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={avatar.name}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Biyografi (Opsiyonel)
              </label>
              <textarea
                id="bio"
                name="bio"
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10 resize-none"
                placeholder="Kendiniz hakkında birkaç şey yazın..."
                rows={2}
                maxLength={200}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  İsteğe bağlı
                </span>
                <span>{formData.bio.length}/200</span>
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                En az 6 karakter
              </p>
            </div>

            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre Tekrar
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all hover:bg-white/10"
                placeholder="••••••••"
                value={formData.password_confirm}
                onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kayıt yapılıyor...
                </span>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-sm text-gray-500">veya</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-purple-500 hover:text-purple-400 font-semibold transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>
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
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-purple-600::-webkit-scrollbar-thumb {
          background-color: rgb(147 51 234);
          border-radius: 3px;
        }
        .scrollbar-track-white\/5::-webkit-scrollbar-track {
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Register;
