import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePhone } from '../utils/helpers';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const success = await login(phone);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your phone number.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RapidAid</h1>
          <p className="text-gray-600">Police Emergency Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Station Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-10"
                  placeholder="0771234567"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your registered phone number
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Register Station
              </Link>
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            🚨 This dashboard receives real-time emergency alerts from citizens
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;