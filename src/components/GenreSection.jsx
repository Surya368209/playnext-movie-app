import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const GenreSection = ({ title, movies }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{title}</h2>
      
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Movies Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar scroll-smooth"
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="flex-shrink-0 group/card"
          >
            <div className="w-[160px] sm:w-[200px] transition-transform duration-300 group-hover/card:scale-105">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'src/assets/notfound.png'
                  }
                  alt={movie.title}
                  className="w-full h-[240px] sm:h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <h3 className="text-white font-medium text-sm line-clamp-2 group-hover/card:text-purple-300 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GenreSection;