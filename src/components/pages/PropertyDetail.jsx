import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import PropertyGallery from '@/components/organisms/PropertyGallery';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await propertyService.getById(id);
        setProperty(result);
        
        // Check if property is saved
        const saved = await savedPropertyService.isPropertySaved(id);
        setIsSaved(saved);
      } catch (err) {
        setError(err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleSaveToggle = async () => {
    setSaveLoading(true);
    
    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(id);
        setIsSaved(false);
        toast.success('Property removed from saved list');
      } else {
        await savedPropertyService.create({
          propertyId: id,
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property added to saved list');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update saved properties');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleContactAgent = () => {
    toast.success('Contact form would open here in a real application');
  };

  const handleScheduleTour = () => {
    toast.success('Tour scheduling would open here in a real application');
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
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          message={error || 'Property not found'}
          onRetry={() => navigate('/')}
          showRetry={true}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'features', label: 'Features', icon: 'Star' },
    { id: 'location', label: 'Location', icon: 'MapPin' }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PropertyGallery images={property.images} title={property.title} />
            </motion.div>

            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                    <span>
                      {property.address.street}, {property.address.neighborhood}, {property.address.city}, {property.address.state} {property.address.zipCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Listed on {format(new Date(property.listingDate), 'MMM dd, yyyy')}</span>
                    <Badge variant="default">{property.propertyType}</Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <div className="flex items-center justify-end gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                      {property.bedrooms} beds
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                      {property.bathrooms} baths
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                      {formatSquareFeet(property.squareFeet)} sqft
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'features' && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <ApperIcon name="Check" className="w-5 h-5 text-success mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'location' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                        <p className="text-gray-700">
                          {property.address.street}<br />
                          {property.address.city}, {property.address.state} {property.address.zipCode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Neighborhood</h4>
                        <p className="text-gray-700">{property.address.neighborhood}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Coordinates</h4>
                        <p className="text-gray-700">
                          {property.coordinates.lat}, {property.coordinates.lng}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-card p-6 sticky top-8"
            >
              <div className="space-y-4">
                <Button
                  onClick={handleSaveToggle}
                  variant={isSaved ? "secondary" : "outline"}
                  className="w-full"
                  loading={saveLoading}
                >
                  <ApperIcon 
                    name="Heart" 
                    className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} 
                  />
                  {isSaved ? 'Saved to Favorites' : 'Save Property'}
                </Button>
                
                <Button
                  onClick={handleScheduleTour}
                  variant="primary"
                  className="w-full"
                >
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  Schedule Tour
                </Button>
                
                <Button
                  onClick={handleContactAgent}
                  variant="outline"
                  className="w-full"
                >
                  <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
                  Contact Agent
                </Button>
              </div>
            </motion.div>

            {/* Property Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold">{formatPrice(property.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet</span>
                  <span className="font-semibold">{formatSquareFeet(property.squareFeet)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per sq ft</span>
                  <span className="font-semibold">
                    ${Math.round(property.price / property.squareFeet)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;