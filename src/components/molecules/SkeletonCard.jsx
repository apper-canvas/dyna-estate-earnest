const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        
        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        {/* Property Details */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
        
        {/* Button */}
        <div className="h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonCard;