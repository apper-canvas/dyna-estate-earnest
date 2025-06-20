import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import savedPropertyService from '@/services/api/savedPropertyService';

const PropertyCard = ({ property, onSaveToggle }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await savedPropertyService.isPropertySaved(property.Id.toString());
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    
    checkSavedStatus();
  }, [property.Id]);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(property.Id.toString());
        setIsSaved(false);
        toast.success('Property removed from saved list');
      } else {
        await savedPropertyService.create({
          propertyId: property.Id.toString(),
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property added to saved list');
      }
      onSaveToggle?.();
    } catch (error) {
      toast.error(error.message || 'Failed to update saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="accent" size="md" className="bg-accent text-white font-semibold shadow-sm">
            {formatPrice(property.price)}
          </Badge>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveToggle}
          disabled={loading}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <ApperIcon 
            name="Heart" 
            className={`w-5 h-5 transition-colors ${
              isSaved 
                ? 'text-error fill-current' 
                : 'text-gray-600 hover:text-error'
            }`}
          />
        </motion.button>

        {/* Property Type Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
          <span className="text-sm truncate">
            {property.address.neighborhood}, {property.address.city}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Square" className="w-4 h-4 mr-1" />
            <span>{formatSquareFeet(property.squareFeet)} sqft</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
          <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertyCard;