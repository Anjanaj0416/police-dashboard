import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { getDirectionsUrl } from '../utils/helpers';

const AlertCard = ({ alert }) => {
  const navigate = useNavigate();
  const { station } = useAuth();

  const handleViewOnMap = () => {
    navigate(`/map/${alert._id}`);
  };

  const handleGetDirections = () => {
    if (station && alert.location) {
      const directionsUrl = getDirectionsUrl(
        station.location.lat,
        station.location.lng,
        alert.location.lat,
        alert.location.lng
      );
      window.open(directionsUrl, '_blank');
    }
  };

  const isNewAlert = alert.status === 'pending';

  return (
    <div
      className={`alert-card ${
        isNewAlert ? 'pulse-red border-danger-600' : 'border-gray-300'
      }`}
    >
      {/* Alert Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-full ${
              isNewAlert ? 'bg-danger-100' : 'bg-gray-100'
            }`}
          >
            <AlertCircle
              className={`w-6 h-6 ${
                isNewAlert ? 'text-danger-600' : 'text-gray-600'
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Emergency Alert - Police Assistance
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDate(alert.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {isNewAlert && (
          <span className="px-3 py-1 bg-danger-100 text-danger-700 text-xs font-bold rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Alert Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Location Coordinates</p>
            <p className="text-sm font-medium text-gray-900">
              {alert.location?.lat.toFixed(6)}, {alert.location?.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {alert.userId && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">User ID:</span> {alert.userId}
          </div>
        )}

        <div className="text-sm">
          <span
            className={`inline-block px-2 py-1 rounded ${
              alert.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : alert.status === 'acknowledged'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            Status: {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleViewOnMap}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <MapPin className="w-5 h-5" />
          <span>View on Map</span>
        </button>
        <button
          onClick={handleGetDirections}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <Navigation className="w-5 h-5" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
};

export default AlertCard;