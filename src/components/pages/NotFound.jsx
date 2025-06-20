import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Illustration */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="relative">
            <ApperIcon 
              name="Home" 
              className="w-32 h-32 text-gray-300 mx-auto mb-4" 
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center">
              <ApperIcon name="X" className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <h1 className="font-display text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">
          Property Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The property you're looking for seems to have moved or doesn't exist. 
          Let's help you find your dream home from our available listings.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Browse Properties
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-card">
          <h3 className="font-semibold text-gray-900 mb-2">
            Need help finding the right property?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Use our search and filter tools to discover properties that match your criteria.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <ApperIcon name="Search" className="w-4 h-4 mr-1" />
              <span>Advanced Search</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Filter" className="w-4 h-4 mr-1" />
              <span>Smart Filters</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Map" className="w-4 h-4 mr-1" />
              <span>Map View</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;