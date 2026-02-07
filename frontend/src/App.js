import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_BASE = 'https://movie-recommender-app-s0zu.onrender.com';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendations = async (input = userInput) => {
    if (!input.trim()) {
      setError('Please enter a movie preference');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/recommend`, {
        userInput: input
      });
      
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
        fetchHistory();
      }
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`);
      setHistory(response.data);
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getRecommendations();
  };

  const exampleQueries = [
    "sci-fi movies about artificial intelligence",
    "romantic comedies from the 90s",
    "psychological thrillers with plot twists",
    "animated movies for adults",
    "award-winning dramas"
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            🎬 AI Movie Recommender
          </h1>
          <p className="app-subtitle">
            Discover your next favorite movie with AI-powered recommendations
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Left Column - Search & Results */}
          <div className="main-content">
            {/* Search Form */}
            <div className="search-section">
              <form onSubmit={handleSubmit} className="movie-form">
                <div className="form-group">
                  <label htmlFor="movie-input">
                    <h2>What kind of movies do you like?</h2>
                    <p className="form-subtitle">
                      Describe your preferences in detail for better recommendations
                    </p>
                  </label>
                  
                  <div className="input-with-button">
                    <input
                      id="movie-input"
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="e.g., 'action movies with strong female leads'"
                      disabled={loading}
                      className="movie-input"
                    />
                    <button 
                      type="submit" 
                      disabled={loading || !userInput.trim()}
                      className="submit-btn"
                    >
                      {loading ? 'Analyzing...' : 'Get Recommendations'}
                    </button>
                  </div>
                </div>

                {/* Example Queries */}
                <div className="example-queries">
                  <p className="examples-title">Try these examples:</p>
                  <div className="query-buttons">
                    {exampleQueries.map((query, index) => (
                      <button
                        key={index}
                        type="button"
                        className="query-btn"
                        onClick={() => {
                          setUserInput(query);
                          getRecommendations(query);
                        }}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="results-section">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>AI is finding the perfect movies for you...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <>
                  <div className="results-header">
                    <h2>
                      🎬 {recommendations.length} Movies Found
                    </h2>
                    <p className="results-subtitle">
                      Based on your preferences
                    </p>
                  </div>
                  
                  <div className="movies-grid">
                    {recommendations.map((movie, index) => (
                      <div key={index} className="movie-card">
                        <div className="movie-card-header">
                          <div className="movie-title-wrapper">
                            <h3 className="movie-title">{movie.title}</h3>
                            <span className="movie-year">({movie.year || movie.release_year})</span>
                          </div>
                          <div className="movie-rating">
                            ⭐ {movie.rating || movie.imdb_rating || 'N/A'}
                          </div>
                        </div>
                        
                        <div className="movie-genre">
                          {movie.genre}
                        </div>
                        
                        <p className="movie-description">
                          {movie.description || movie.short_description}
                        </p>
                        
                        {movie.matchReason && (
                          <div className="match-reason">
                            <strong>Why this matches:</strong> {movie.matchReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎬</div>
                  <h3>Start Your Movie Journey</h3>
                  <p>Describe what you're in the mood for and get AI-powered recommendations!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - History */}
          <div className="sidebar">
            <div className="history-section">
              <h2>📜 Recent Searches</h2>
              
              {history.length === 0 ? (
                <p className="no-history">No search history yet</p>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-query">
                        <strong>Q:</strong> {item.user_input}
                      </div>
                      <div className="history-movies">
                        <strong>Found:</strong> {item.recommended_movies.length} movies
                      </div>
                      <div className="history-time">
                        {item.timestamp || item.formatted_time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>🎬 AI Movie Recommender • Powered by Fastify & React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;