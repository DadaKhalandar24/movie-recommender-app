import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Bookmark, Share2, Calendar, Film } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const handleRating = (rating) => {
    setUserRating(rating);
    // Here you would typically send the rating to your backend
  };

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        '--poster-color': movie.poster_color || '#6366f1'
      }}
    >
      {/* Movie Poster Placeholder with Gradient */}
      <div className="movie-poster">
        <div 
          className="poster-gradient"
          style={{ background: `linear-gradient(135deg, ${movie.poster_color}44, ${movie.poster_color}22)` }}
        >
          <Film size={48} className="poster-icon" />
        </div>
        
        {/* Rating Badge */}
        <div className="rating-badge">
          <Star size={14} fill="currentColor" />
          <span>{movie.imdb_rating || 'N/A'}</span>
        </div>
        
        {/* Action Buttons */}
        <motion.div 
          className="poster-actions"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <button className="action-btn" title="Watch Trailer">
            <Play size={16} />
          </button>
          <button 
            className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button className="action-btn" title="Share">
            <Share2 size={16} />
          </button>
        </motion.div>
      </div>

      {/* Movie Info */}
      <div className="movie-info">
        <div className="movie-header">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-year">
            <Calendar size={14} />
            <span>{movie.release_year}</span>
          </div>
        </div>

        <div className="movie-genres">
          {movie.genre?.split(',').map((genre, idx) => (
            <span key={idx} className="genre-tag">
              {genre.trim()}
            </span>
          ))}
        </div>

        <p className="movie-description">{movie.short_description}</p>

        {/* Why Match Section */}
        <div className="why-match">
          <div className="why-match-label">
            <Star size={12} />
            <span>Why this matches:</span>
          </div>
          <p className="why-match-text">{movie.why_match}</p>
        </div>

        {/* User Rating */}
        <div className="user-rating">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= userRating ? 'active' : ''}`}
                onClick={() => handleRating(star)}
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star size={18} fill={star <= userRating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <span className="rating-text">
            {userRating > 0 ? `You rated: ${userRating} stars` : 'Rate this movie'}
          </span>
        </div>

        {/* Additional Info */}
        <div className="movie-meta">
          <div className="meta-item">
            <span className="meta-label">Match Score</span>
            <div className="match-bar">
              <div 
                className="match-fill" 
                style={{ width: `${Math.min(95, 70 + index * 5)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;