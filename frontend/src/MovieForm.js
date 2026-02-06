import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Zap, TrendingUp } from 'lucide-react';
import './MovieForm.css';

const MovieForm = ({ onSubmit, loading, searchQuery, setSearchQuery }) => {
  const [input, setInput] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchQuery(input);
      onSubmit(input);
    }
  };

  const examplePrompts = [
    "Sci-fi movies about AI and consciousness",
    "Mind-bending psychological thrillers",
    "90s romantic comedies with strong leads",
    "Epic fantasy movies like Lord of the Rings",
    "Cult classic horror films from the 80s",
    "Movies about time travel with clever plots",
    "Award-winning foreign language films",
    "Feel-good animated movies for adults",
    "Gritty crime dramas based on true stories",
    "Space exploration movies with realism"
  ];

  const quickFilters = [
    { icon: "🎬", label: "Action", query: "High-octane action movies with great choreography" },
    { icon: "😂", label: "Comedy", query: "Hilarious comedies that will make me laugh out loud" },
    { icon: "💖", label: "Romance", query: "Heartwarming romantic movies with great chemistry" },
    { icon: "🚀", label: "Sci-Fi", query: "Thought-provoking science fiction movies about the future" },
    { icon: "🔪", label: "Horror", query: "Scary horror movies with psychological depth" },
    { icon: "🕵️", label: "Mystery", query: "Clever mystery movies with unexpected twists" }
  ];

  return (
    <div className="movie-form-container">
      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-header">
          <div className="form-icon">
            <Zap size={24} />
          </div>
          <div>
            <h2>What kind of movies do you like?</h2>
            <p className="form-subtitle">
              Be specific for better AI recommendations. Describe genres, moods, or specific elements.
            </p>
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Mind-bending sci-fi movies with philosophical themes'"
              disabled={loading}
              className="movie-input"
            />
            <button 
              type="button" 
              className="voice-btn"
              title="Voice input"
            >
              <Mic size={18} />
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="submit-btn"
          >
            {loading ? (
              <>
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
                Analyzing...
              </>
            ) : (
              <>
                <Send size={18} />
                Get Recommendations
              </>
            )}
          </button>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <div className="filters-header">
            <TrendingUp size={18} />
            <span>Popular Categories</span>
          </div>
          <div className="filter-buttons">
            {quickFilters.map((filter, index) => (
              <motion.button
                key={index}
                type="button"
                className="filter-btn"
                onClick={() => {
                  setInput(filter.query);
                  setSearchQuery(filter.query);
                  onSubmit(filter.query);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="filter-icon">{filter.icon}</span>
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Example Prompts */}
        <div className="example-prompts">
          <h3>Try these detailed prompts:</h3>
          <div className="prompts-grid">
            {examplePrompts.map((prompt, index) => (
              <motion.button
                key={index}
                type="button"
                className="prompt-btn"
                onClick={() => {
                  setInput(prompt);
                  setSearchQuery(prompt);
                  onSubmit(prompt);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;