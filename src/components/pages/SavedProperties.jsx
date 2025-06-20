import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import PropertyCard from '@/components/molecules/PropertyCard';
import savedPropertyService from '@/services/api/savedPropertyService';
import propertyService from '@/services/api/propertyService';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get saved property records
      const savedPropertyRecords = await savedPropertyService.getAll();
      setSavedProperties(savedPropertyRecords);
      
      // Get full property details for each saved property
      const propertyPromises = savedPropertyRecords.map(async (savedProp) => {
        try {
          return await propertyService.getById(savedProp.propertyId);
        } catch (err) {
          console.error(`Failed to load property ${savedProp.propertyId}:`, err);
          return null;
        }
      });
      
      const propertyResults = await Promise.all(propertyPromises);
      const validProperties = propertyResults.filter(prop => prop !== null);
      setProperties(validProperties);
      
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const handleSaveToggle = () => {
    // Reload the saved properties when one is removed
    loadSavedProperties();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      try {
        // Delete all saved properties
        const deletePromises = savedProperties.map(savedProp => 
          savedPropertyService.delete(savedProp.Id)
        );
        
        await Promise.all(deletePromises);
        setSavedProperties([]);
        setProperties([]);
        toast.success('All saved properties removed');
      } catch (err) {
        toast.error('Failed to clear saved properties');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="text-primary mb-4" />
          <p className="text-gray-600">Loading your saved properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={loadSavedProperties}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                Saved Properties
              </h1>
              <p className="text-gray-600">
                {properties.length === 0 
                  ? 'No saved properties yet'
                  : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} saved`
                }
              </p>
            </div>

            {properties.length > 0 && (
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear All Button */}
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                  className="text-error hover:text-error hover:border-error"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length === 0 ? (
          <EmptyState
            title="No saved properties yet"
            description="Start browsing properties and save your favorites to see them here. You can save properties by clicking the heart icon on any property card."
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/'}
            icon="Heart"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }
            `}
          >
            <AnimatePresence>
              {properties.map((property, index) => (
                <motion.div
                  key={property.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard 
                    property={property} 
                    onSaveToggle={handleSaveToggle}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;