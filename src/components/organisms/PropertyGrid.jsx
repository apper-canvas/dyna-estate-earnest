import { motion } from 'framer-motion';
import PropertyCard from '@/components/molecules/PropertyCard';
import SkeletonCard from '@/components/molecules/SkeletonCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const PropertyGrid = ({ 
  properties = [], 
  loading = false, 
  error = null, 
  onRetry,
  onSaveToggle,
  emptyTitle = "No properties found",
  emptyDescription = "Try adjusting your search criteria or browse our featured listings"
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SkeletonCard />
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!properties.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon="Building2"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PropertyCard 
            property={property} 
            onSaveToggle={onSaveToggle}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyGrid;