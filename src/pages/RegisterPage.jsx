import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Building, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePhone, validateGoogleMapsLink } from '../utils/helpers';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    stationName: '',
    phone: '',
    googleMapsLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.stationName.trim()) {
      newErrors.stationName = 'Station name is required';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!validateGoogleMapsLink(formData.googleMapsLink)) {
      newErrors.googleMapsLink = 'Please enter a valid Google Maps link';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const success = await register(formData);
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RapidAid</h1>
          <p className="text-gray-600">Register Your Police Station</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Link
              to="/login"
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Station Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station Name */}
            <div>
              <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-2">
                Station Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="stationName"
                  name="stationName"
                  type="text"
                  value={formData.stationName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.stationName ? 'border-danger-500' : ''}`}
                  placeholder="Colombo Police Station"
                  required
                />
              </div>
              {errors.stationName && (
                <p className="mt-1 text-sm text-danger-600">{errors.stationName}</p>
              )}
            </div>

            {/* Phone Number */}
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
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.phone ? 'border-danger-500' : ''}`}
                  placeholder="0771234567"
                  required
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>
              )}
            </div>

            {/* Google Maps Link */}
            <div>
              <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Location Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="googleMapsLink"
                  name="googleMapsLink"
                  type="url"
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.googleMapsLink ? 'border-danger-500' : ''}`}
                  placeholder="https://maps.google.com/?q=6.9271,79.8612"
                  required
                />
              </div>
              {errors.googleMapsLink && (
                <p className="mt-1 text-sm text-danger-600">{errors.googleMapsLink}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Open Google Maps, find your location, and paste the share link here
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                'Register Station'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> After registration, use your phone number to login and start receiving emergency alerts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;