import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

const images = [
  'src/assets/hero1.png',
  'src/assets/hero2.png',
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid too many API calls
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 2000, [searchTerm]); //fro 1 sec

  // Image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10 * 60 * 60 *1000); // 10 hrs

    return () => clearInterval(timer);
  }, []);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }
    catch (error) {
      console.error('Error loading trending movies:', error);
    }
  };

    const fetchMovies = async (query = '') => {
      setIsLoading(true);
      setErrorMessage('');
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      try {
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if(data.response === 'False')
        {
          setErrorMessage(data.Error || 'Failed to fetch movies.');
          setMovieList([]);
          console.error(data.Error);
          return;
        }
        console.log(data);
        console.log(data.total_pages[1]);
        setMovieList(data.results || []); // Save movies to state
        
        if(query && data.results.length > 0) {
          // Update search count in Appwrite
          await updateSearchCount(query, data.results[0]);

        }
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }
      finally {
        setIsLoading(false);
      }
    };
  // Fetch movies on mount
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
      console.log("useEffect triggered");
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <div className="w-[600px] h-[250px] max-w-full overflow-hidden rounded-md  mx-auto mt-20">
            <img 
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full object-cover transition-all duration-500"
            />
          </div>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {
          trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul className='mt-[1px]'>
                {trendingMovies.map((movie,index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title}></img>
                  </li>
                ))}
              </ul>
            </section>
          )
        }

        <section className="all-movies">
          <h2 className='mt-[30px]'>All Movies</h2>
          {isLoading ? (<Spinner />) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}

        </section>
      </div>
    </main>
  );
}

export default App;
