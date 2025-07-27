import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import TrendingSection from '../components/TrendingSection';
import GenreSection from '../components/GenreSection';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getTrendingMovies } from '../appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

// Popular movie genres with their TMDB IDs
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  };

  const fetchMoviesByGenre = async (genreId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`,
        API_OPTIONS
      );
      const data = await response.json();
      return data.results?.slice(0, 10) || [];
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      return [];
    }
  };

  const loadGenreMovies = async () => {
    setIsLoading(true);
    const genreMoviesData = {};
    
    // Load movies for each genre
    for (const genre of GENRES) {
      const movies = await fetchMoviesByGenre(genre.id);
      genreMoviesData[genre.id] = movies;
    }
    
    setGenreMovies(genreMoviesData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTrendingMovies();
    loadGenreMovies();
  }, []);

  return (
    <main className="relative z-10 pt-16">
      <HeroSection />
      
      {trendingMovies.length > 0 && (
        <TrendingSection movies={trendingMovies} />
      )}

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 pb-20">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          GENRES.map((genre) => (
            <GenreSection
              key={genre.id}
              title={genre.name}
              movies={genreMovies[genre.id] || []}
            />
          ))
        )}
      </div>
    </main>
  );
};

export default HomePage;