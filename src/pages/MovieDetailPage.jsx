import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Spinner from '../components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch movie details
      const movieResponse = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
      if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
      const movieData = await movieResponse.json();

      // Fetch credits
      const creditsResponse = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
      const creditsData = creditsResponse.ok ? await creditsResponse.json() : null;

      // Fetch videos (trailers)
      const videosResponse = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
      const videosData = videosResponse.ok ? await videosResponse.json() : null;

      // Fetch similar movies
      const similarResponse = await fetch(`${API_BASE_URL}/movie/${id}/similar`, API_OPTIONS);
      const similarData = similarResponse.ok ? await similarResponse.json() : null;

      setMovie(movieData);
      setCredits(creditsData);
      setVideos(videosData?.results?.filter(video => video.type === 'Trailer') || []);
      setSimilarMovies(similarData?.results?.slice(0, 6) || []);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The movie you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const trailer = videos.find(video => video.site === 'YouTube');
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {backdropUrl && (
          <>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </>
        )}

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg font-semibold transition-colors backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Movie Info Overlay */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'src/assets/notfound.png'
                  }
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Details */}
              <div className="flex-1 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500" size={20} fill="currentColor" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-sm">({movie.vote_count} votes)</span>
                  </div>
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-gray-200 text-lg leading-relaxed mb-8">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Play size={20} fill="currentColor" />
                      Watch Trailer
                    </a>
                  )}
                  
                  <button className="flex items-center gap-2 bg-gray-600/70 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600/90 transition-colors backdrop-blur-sm">
                    <Plus size={20} />
                    Add to List
                  </button>
                  
                  <button className="flex items-center gap-2 bg-gray-600/70 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600/90 transition-colors backdrop-blur-sm">
                    <ThumbsUp size={20} />
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 space-y-12">
        {/* Cast */}
        {credits?.cast && credits.cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
              {credits.cast.slice(0, 10).map((person) => (
                <div key={person.id} className="flex-shrink-0 text-center">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : 'src/assets/notfound.png'
                    }
                    alt={person.name}
                    className="w-24 h-24 object-cover rounded-full mb-2"
                  />
                  <p className="text-white text-sm font-medium">{person.name}</p>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Movie Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Budget</p>
            <p className="text-white font-bold text-lg">
              {movie.budget ? formatCurrency(movie.budget) : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Revenue</p>
            <p className="text-white font-bold text-lg">
              {movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Language</p>
            <p className="text-white font-bold text-lg uppercase">
              {movie.original_language}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-white font-bold text-lg">{movie.status}</p>
          </div>
        </section>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  to={`/movie/${similarMovie.id}`}
                  className="group"
                >
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={
                        similarMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                          : 'src/assets/notfound.png'
                      }
                      alt={similarMovie.title}
                      className="w-full h-[200px] object-cover rounded-lg"
                    />
                    <h3 className="text-white text-sm font-medium mt-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {similarMovie.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;