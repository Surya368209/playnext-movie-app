import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pattern"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;