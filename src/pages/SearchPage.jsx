import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { updateSearchCount } from '../appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (page === 1) {
        setMovies(data.results || []);
        // Update search count for the first result
        if (data.results && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setTotalPages(data.total_pages || 0);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
      setCurrentPage(1);
      searchMovies(searchTerm.trim(), 1);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      const query = searchParams.get('q');
      if (query) {
        searchMovies(query, nextPage);
      }
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchTerm) {
      setSearchTerm(query);
      searchMovies(query, 1);
    }
  }, [searchParams, searchMovies]);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Movies</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {isLoading ? <Spinner /> : <Search size={20} />}
              Search
            </button>
          </form>

          {/* Results Info */}
          {hasSearched && (
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <p>
                {movies.length > 0 
                  ? `Found ${movies.length} results for "${searchParams.get('q')}"`
                  : `No results found for "${searchParams.get('q')}"`
                }
              </p>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search Results */}
        {movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'src/assets/notfound.png'
                      }
                      alt={movie.title}
                      className="w-full h-[240px] sm:h-[300px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating */}
                    {movie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
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
        )}

        {/* Load More Button */}
        {movies.length > 0 && currentPage < totalPages && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? <Spinner /> : 'Load More'}
            </button>
          </div>
        )}

        {/* No Results */}
        {hasSearched && movies.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">
              Try searching with different keywords or check your spelling.
            </p>
            <Link
              to="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Popular Movies
            </Link>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Search for Movies</h3>
            <p className="text-gray-400">
              Enter a movie title above to start searching our extensive database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;