const LoadingSkeleton = () => {
  return (
    <div className="space-y-12">
      {[...Array(6)].map((_, genreIndex) => (
        <div key={genreIndex} className="animate-pulse">
          {/* Genre Title Skeleton */}
          <div className="h-8 bg-gray-700 rounded-lg w-48 mb-6"></div>
          
          {/* Movies Row Skeleton */}
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, movieIndex) => (
              <div key={movieIndex} className="flex-shrink-0">
                <div className="w-[160px] sm:w-[200px]">
                  <div className="h-[240px] sm:h-[300px] bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;