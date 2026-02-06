import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import './MovieList.css';

const MovieList = ({ movies }) => {
  if (!movies.length) return null;

  return (
    <div className="movie-list-container">
      <div className="list-actions">
        <div className="sort-options">
          <span>Sort by:</span>
          <select className="sort-select">
            <option>Relevance</option>
            <option>Rating</option>
            <option>Year (Newest)</option>
            <option>Year (Oldest)</option>
          </select>
        </div>
        
        <div className="view-toggle">
          <button className="view-btn active" title="Grid view">
            <span className="grid-icon">◼◼◼</span>
          </button>
          <button className="view-btn" title="List view">
            <span className="list-icon">≡≡≡</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div 
          className="movies-grid"
          layout
        >
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="list-footer">
        <p className="recap">
          Found <span className="highlight">{movies.length}</span> movies matching your preferences.
          These recommendations are powered by AI and updated in real-time.
        </p>
      </div>
    </div>
  );
};

export default MovieList;