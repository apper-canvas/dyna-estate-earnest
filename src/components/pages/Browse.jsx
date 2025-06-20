import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPill from '@/components/molecules/FilterPill';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import propertyService from '@/services/api/propertyService';

const Browse = () => {
  const location = useLocation();
  const isRentPage = location.pathname === '/rent';
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest');
  
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyTypes: [],
    bedroomsMin: '',
    bathroomsMin: '',
    squareFeetMin: '',
    location: '',
    search: ''
  });

  const loadProperties = async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyService.getAll({
        ...filters,
        ...filterParams
      });
      
      // Sort properties
      let sortedProperties = [...result];
      switch (sortBy) {
        case 'price-low':
          sortedProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedProperties.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          sortedProperties.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case 'oldest':
          sortedProperties.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
          break;
        default:
          break;
      }
      
      setProperties(sortedProperties);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [sortBy]);

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    loadProperties(newFilters);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    loadProperties(newFilters);
    setShowFilters(false);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      propertyTypes: [],
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: '',
      location: '',
      search: ''
    };
    setFilters(clearedFilters);
    loadProperties(clearedFilters);
  };

  const removeFilter = (filterKey, value = null) => {
    let newFilters = { ...filters };
    
    if (filterKey === 'propertyTypes' && value) {
      newFilters.propertyTypes = newFilters.propertyTypes.filter(type => type !== value);
    } else {
      newFilters[filterKey] = Array.isArray(newFilters[filterKey]) ? [] : '';
    }
    
    setFilters(newFilters);
    loadProperties(newFilters);
  };

  const getActiveFilterPills = () => {
    const pills = [];
    
    if (filters.search) {
      pills.push({
        key: 'search',
        label: `Search: "${filters.search}"`,
        variant: 'accent'
      });
    }
    
    if (filters.priceMin || filters.priceMax) {
      const min = filters.priceMin ? `$${parseInt(filters.priceMin).toLocaleString()}` : '';
      const max = filters.priceMax ? `$${parseInt(filters.priceMax).toLocaleString()}` : '';
      const priceLabel = min && max ? `${min} - ${max}` : min ? `${min}+` : `Under ${max}`;
      pills.push({
        key: 'price',
        label: `Price: ${priceLabel}`,
        variant: 'primary'
      });
    }
    
    if (filters.propertyTypes?.length > 0) {
      filters.propertyTypes.forEach(type => {
        pills.push({
          key: 'propertyTypes',
          value: type,
          label: type,
          variant: 'default'
        });
      });
    }
    
    if (filters.bedroomsMin) {
      pills.push({
        key: 'bedroomsMin',
        label: `${filters.bedroomsMin}+ bedrooms`,
        variant: 'default'
      });
    }
    
    if (filters.bathroomsMin) {
      pills.push({
        key: 'bathroomsMin',
        label: `${filters.bathroomsMin}+ bathrooms`,
        variant: 'default'
      });
    }
    
    if (filters.squareFeetMin) {
      pills.push({
        key: 'squareFeetMin',
        label: `${parseInt(filters.squareFeetMin).toLocaleString()}+ sqft`,
        variant: 'default'
      });
    }
    
    if (filters.location) {
      pills.push({
        key: 'location',
        label: `Location: ${filters.location}`,
        variant: 'default'
      });
    }
    
    return pills;
  };

  const activeFilterPills = getActiveFilterPills();

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
              {isRentPage ? 'Find Your Perfect Rental' : 'Discover Your Dream Home'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isRentPage 
                ? 'Browse premium rental properties with modern amenities and flexible terms'
                : 'Explore luxury properties with stunning views and premium features'
              }
            </p>
          </motion.div>
          
          <SearchBar
            onSearch={handleSearch}
            placeholder={`Search ${isRentPage ? 'rentals' : 'properties'} by location, address, or features...`}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Left Side - Results Count & Mobile Filter */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowFilters(true)}
                  variant="outline"
                  className="lg:hidden"
                >
                  <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterPills.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                      {activeFilterPills.length}
                    </span>
                  )}
                </Button>
                
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${properties.length} properties found`}
                </span>
              </div>

              {/* Right Side - View & Sort Controls */}
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

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterPills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                <AnimatePresence>
                  {activeFilterPills.map((pill, index) => (
                    <FilterPill
                      key={`${pill.key}-${pill.value || index}`}
                      label={pill.label}
                      variant={pill.variant}
                      onRemove={() => removeFilter(pill.key, pill.value)}
                    />
                  ))}
                </AnimatePresence>
                <Button
                  onClick={handleClearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </motion.div>
            )}

            {/* Property Grid */}
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onRetry={() => loadProperties()}
              onSaveToggle={() => {}} // Will trigger re-render of heart states
              emptyTitle={isRentPage ? "No rental properties found" : "No properties found"}
              emptyDescription={isRentPage 
                ? "Try adjusting your search criteria or browse our available rentals"
                : "Try adjusting your search criteria or browse our featured listings"
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />
    </div>
  );
};

export default Browse;