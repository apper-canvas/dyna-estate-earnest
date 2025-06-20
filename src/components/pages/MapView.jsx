import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ErrorState from "@/components/molecules/ErrorState";
import propertyService from "@/services/api/propertyService";

const MapView = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 }); // Los Angeles
  const [zoom, setZoom] = useState(10);
  const [showPropertyCard, setShowPropertyCard] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await propertyService.getAll();
        setProperties(result);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleSearch = async (searchTerm) => {
    try {
      const result = await propertyService.getAll({ search: searchTerm });
      setProperties(result);
      
      if (result.length > 0) {
        // Center map on first result
        const firstProperty = result[0];
        setMapCenter({
          lat: firstProperty.coordinates.lat,
          lng: firstProperty.coordinates.lng
        });
        setZoom(12);
      }
    } catch (err) {
      toast.error('Failed to search properties');
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowPropertyCard(true);
    setMapCenter({
      lat: property.coordinates.lat,
      lng: property.coordinates.lng
    });
    setZoom(15);
  };

  const handleViewDetails = () => {
    if (selectedProperty) {
      navigate(`/property/${selectedProperty.Id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="text-primary mb-4" />
          <p className="text-gray-600">Loading map view...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Map View
              </h1>
              <p className="text-gray-600">
                {properties.length} properties shown
              </p>
            </div>
            
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search properties by location..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mock Map */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Property Markers */}
          {properties.map((property, index) => (
            <motion.button
              key={property.Id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePropertyClick(property)}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 
                min-w-max px-3 py-2 bg-white rounded-lg shadow-lg border-2 transition-all
                ${selectedProperty?.Id === property.Id 
                  ? 'border-accent shadow-xl z-20' 
                  : 'border-gray-200 hover:border-accent hover:shadow-xl z-10'
                }
              `}
              style={{
                left: `${20 + (index % 5) * 15 + Math.random() * 10}%`,
                top: `${20 + Math.floor(index / 5) * 15 + Math.random() * 10}%`
              }}
            >
              {/* House Icon */}
              <div className="flex items-center space-x-2">
                <div className={`
                  p-1 rounded-full 
                  ${selectedProperty?.Id === property.Id 
                    ? 'bg-accent text-white' 
                    : 'bg-primary text-white'
                  }
                `}>
                  <ApperIcon name="Home" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {property.bedrooms}bd, {property.bathrooms}ba
                  </div>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2 z-30">
            <button
              onClick={() => setZoom(Math.min(zoom + 1, 18))}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ApperIcon name="Plus" className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 1, 8))}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ApperIcon name="Minus" className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Current Location Button */}
          <button
            onClick={() => {
              setMapCenter({ lat: 34.0522, lng: -118.2437 });
              setZoom(10);
            }}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow z-30"
          >
            <ApperIcon name="MapPin" className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Property Info Card */}
        <AnimatePresence>
          {showPropertyCard && selectedProperty && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white shadow-2xl z-40 mx-4 mb-4 rounded-lg overflow-hidden lg:absolute lg:bottom-4 lg:left-4 lg:right-auto lg:w-96 lg:mx-0"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPropertyCard(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>

              {/* Property Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="accent" className="bg-accent text-white font-semibold">
                    {formatPrice(selectedProperty.price)}
                  </Badge>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {selectedProperty.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                  <span className="text-sm truncate">
                    {selectedProperty.address.neighborhood}, {selectedProperty.address.city}
                  </span>
                </div>

                {/* Property Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                      <span>{selectedProperty.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                      <span>{selectedProperty.bathrooms} baths</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                    <span>{formatSquareFeet(selectedProperty.squareFeet)} sqft</span>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {selectedProperty.description}
                </p>

                {/* Action Button */}
                <Button 
                  onClick={handleViewDetails}
                  variant="primary"
                  className="w-full"
                >
                  View Full Details
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapView;