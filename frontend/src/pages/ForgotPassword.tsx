import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setSuccess(true);
        toast.success('Şifre sıfırlama linki e-posta adresinize gönderildi');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Bir hata oluştu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
          }}></div>
        </div>

        <div className="relative w-full max-w-md px-6">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 border border-gray-800 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">E-posta Gönderildi</h2>
            <p className="text-gray-400 mb-6">
              Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin ve linke tıklayarak şifrenizi sıfırlayın.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Link 1 saat içinde geçersiz olacaktır.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)',
        }}></div>
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-4xl font-bold tracking-tight mb-2">
            SOSYAL KÜTÜPHANE
          </h1>
          <p className="text-gray-400 text-sm">Şifrenizi sıfırlayın</p>
        </div>

        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h2>
          <p className="text-gray-400 text-sm mb-6">
            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
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
                className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
              Giriş sayfasına dön
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-xs">
            © 2025 Sosyal Kütüphane. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
