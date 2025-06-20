import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  onClearAll 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment'];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = localFilters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('propertyTypes', newTypes);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      propertyTypes: [],
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: '',
      location: ''
    };
    setLocalFilters(clearedFilters);
    onClearAll();
    onClose();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:w-full lg:shadow-none lg:bg-surface-50 overflow-y-auto"
          >
            <div className="p-6 border-b lg:border-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={localFilters.priceMin || ''}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={localFilters.priceMax || ''}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Property Type</h3>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(localFilters.propertyTypes || []).includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="rounded border-gray-300 text-accent focus:ring-accent/50"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Minimum Bedrooms</h3>
                <div className="grid grid-cols-5 gap-2">
                  {bedroomOptions.map((count) => (
                    <button
                      key={count}
                      onClick={() => handleFilterChange('bedroomsMin', 
                        localFilters.bedroomsMin === count ? '' : count
                      )}
                      className={`
                        py-2 px-3 text-sm font-medium rounded-lg border transition-colors
                        ${localFilters.bedroomsMin === count
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent'
                        }
                      `}
                    >
                      {count}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Minimum Bathrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {bathroomOptions.map((count) => (
                    <button
                      key={count}
                      onClick={() => handleFilterChange('bathroomsMin', 
                        localFilters.bathroomsMin === count ? '' : count
                      )}
                      className={`
                        py-2 px-3 text-sm font-medium rounded-lg border transition-colors
                        ${localFilters.bathroomsMin === count
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent'
                        }
                      `}
                    >
                      {count}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Feet */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Minimum Square Feet</h3>
                <Input
                  type="number"
                  placeholder="e.g. 1000"
                  value={localFilters.squareFeetMin || ''}
                  onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                />
              </div>

              {/* Location */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                <Input
                  placeholder="City, neighborhood, or area"
                  value={localFilters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t space-y-3">
              <Button
                onClick={handleApplyFilters}
                variant="primary"
                className="w-full"
              >
                Apply Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" size="sm" className="ml-2">
                    {Object.values(localFilters).filter(value => 
                      Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
                    ).length}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;