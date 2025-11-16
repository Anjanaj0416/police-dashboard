import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { formatDate, getDirectionsUrl, calculateDistance } from '../utils/helpers';
import toast from 'react-hot-toast';

const MapViewPage = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { station } = useAuth();
  const { alerts } = useAlerts();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the alert from the alerts context
    const foundAlert = alerts.find((a) => a._id === alertId);
    if (foundAlert) {
      setAlert(foundAlert);
      setLoading(false);
    } else {
      // If not found in context, you could fetch it from the API
      // For now, show an error
      toast.error('Alert not found');
      setLoading(false);
    }
  }, [alertId, alerts]);

  const handleGetDirections = () => {
    if (station && alert) {
      const directionsUrl = getDirectionsUrl(
        station.location.lat,
        station.location.lng,
        alert.location.lat,
        alert.location.lng
      );
      window.open(directionsUrl, '_blank');
    }
  };

  if (loading) {
    return <Loading message="Loading map..." />;
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert Not Found</h2>
            <p className="text-gray-600 mb-6">
              The alert you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const distance = station
    ? calculateDistance(
        station.location.lat,
        station.location.lng,
        alert.location.lat,
        alert.location.lng
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Alert Details Sidebar */}
        <div className="lg:w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Alert Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Alert Details</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  alert.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : alert.status === 'acknowledged'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {alert.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatDate(alert.createdAt)}</span>
            </div>
          </div>

          {/* Alert Information */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Alert Type</h3>
              <p className="text-lg font-medium text-gray-900">Police Assistance</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Emergency Location</h3>
              <p className="text-sm text-gray-900 font-mono">
                Lat: {alert.location.lat.toFixed(6)}
                <br />
                Lng: {alert.location.lng.toFixed(6)}
              </p>
            </div>

            {station && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Station</h3>
                  <p className="text-sm text-gray-900">{station.stationName}</p>
                  <p className="text-xs text-gray-600 mt-1 font-mono">
                    Lat: {station.location.lat.toFixed(6)}
                    <br />
                    Lng: {station.location.lng.toFixed(6)}
                  </p>
                </div>

                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary-700 mb-2">
                    Distance to Alert
                  </h3>
                  <p className="text-2xl font-bold text-primary-900">{distance} km</p>
                </div>
              </>
            )}

            {alert.userId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">User ID</h3>
                <p className="text-sm text-gray-900 font-mono">{alert.userId}</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGetDirections}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            <Navigation className="w-5 h-5" />
            <span>Navigate to Location</span>
          </button>

          {/* Info */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              📍 Click the button above to open Google Maps with turn-by-turn navigation to the
              emergency location.
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 h-[400px] lg:h-auto">
          <Map
            stationLocation={station?.location}
            alertLocation={alert.location}
            onGetDirections={handleGetDirections}
          />
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;