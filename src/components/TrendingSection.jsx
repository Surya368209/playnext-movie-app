import { Link } from 'react-router-dom';

const TrendingSection = ({ movies }) => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
        🔥 Trending Now
      </h2>
      
      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
        {movies.map((movie, index) => (
          <Link
            key={movie.$id}
            to={`/movie/${movie.movie_id}`}
            className="flex-shrink-0 group"
          >
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              {/* Trending Number */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                <span className="fancy-text text-gray-600/50 group-hover:text-purple-500/50 transition-colors">
                  {index + 1}
                </span>
              </div>
              
              {/* Movie Poster */}
              <div className="ml-8 relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={movie.poster_url}
                  alt={movie.searchTerm}
                  className="w-full h-[300px] sm:h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Search Count Badge */}
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {movie.count} searches
                </div>
              </div>
              
              {/* Movie Title */}
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 line-clamp-2 ml-8">
                {movie.searchTerm}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;