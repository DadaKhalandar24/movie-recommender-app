const fastify = require('fastify')({ 
  logger: true  // Simple built-in logger
});
const cors = require('@fastify/cors');
const sqlite3 = require('sqlite3').verbose();

// Initialize database
const db = new sqlite3.Database('./movies.db', (err) => {
  if (err) {
    console.error('❌ Database error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    
    // Create table
    db.run(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_input TEXT NOT NULL,
        recommended_movies TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('❌ Table creation error:', err.message);
      } else {
        console.log('✅ Table ready');
      }
    });
  }
});

// Register CORS
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
});

// 🎬 HEALTH CHECK
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    service: 'Movie Recommender API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
});

// 🎥 GET RECOMMENDATIONS
fastify.post('/recommend', async (request, reply) => {
  const { userInput } = request.body;

  if (!userInput || userInput.trim().length === 0) {
    return reply.code(400).send({ 
      error: 'Please describe what movies you like',
      example: 'Try: "sci-fi movies" or "romantic comedies from the 90s"'
    });
  }

  console.log(`📥 Received request: "${userInput}"`);

  // Generate movie recommendations
  const recommendations = getMovieRecommendations(userInput);
  
  // Save to database
  db.run(
    'INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)',
    [userInput, JSON.stringify(recommendations)],
    function(err) {
      if (err) {
        console.error('💾 Save error:', err.message);
      } else {
        console.log(`💾 Saved recommendation #${this.lastID}`);
      }
    }
  );

  return {
    success: true,
    query: userInput,
    recommendations,
    count: recommendations.length,
    generated_at: new Date().toISOString()
  };
});

// 📜 GET HISTORY
fastify.get('/history', async (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, user_input, recommended_movies, 
              datetime(timestamp, 'localtime') as formatted_time
       FROM recommendations 
       ORDER BY timestamp DESC 
       LIMIT 10`,
      (err, rows) => {
        if (err) {
          console.error('📜 History error:', err.message);
          reject({ error: 'Database error' });
        } else {
          const parsedRows = rows.map(row => ({
            id: row.id,
            user_input: row.user_input,
            recommended_movies: JSON.parse(row.recommended_movies),
            timestamp: row.formatted_time
          }));
          resolve(parsedRows);
        }
      }
    );
  });
});

// 🎯 RECOMMENDATION LOGIC
function getMovieRecommendations(userInput) {
  const input = userInput.toLowerCase();
  
  // All available movies
  const allMovies = [
    {
      title: "The Matrix",
      year: 1999,
      genre: "Action, Sci-Fi",
      description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
      rating: 8.7,
      matchReason: "Perfect blend of sci-fi and philosophical themes"
    },
    {
      title: "Inception",
      year: 2010,
      genre: "Action, Sci-Fi, Thriller",
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task.",
      rating: 8.8,
      matchReason: "Mind-bending sci-fi with psychological depth"
    },
    {
      title: "The Dark Knight",
      year: 2008,
      genre: "Action, Crime, Drama",
      description: "Batman faces the Joker, a criminal mastermind who seeks to undermine society.",
      rating: 9.0,
      matchReason: "Superhero genre elevated to art"
    },
    {
      title: "Parasite",
      year: 2019,
      genre: "Comedy, Drama, Thriller",
      description: "Greed and class discrimination threaten the relationship between a wealthy family and a poor family.",
      rating: 8.6,
      matchReason: "Brilliant social commentary with suspense"
    },
    {
      title: "The Shawshank Redemption",
      year: 1994,
      genre: "Drama",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
      rating: 9.3,
      matchReason: "Universal acclaim and compelling storytelling"
    },
    {
      title: "Pulp Fiction",
      year: 1994,
      genre: "Crime, Drama",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.",
      rating: 8.9,
      matchReason: "Iconic nonlinear storytelling"
    },
    {
      title: "Forrest Gump",
      year: 1994,
      genre: "Drama, Romance",
      description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold.",
      rating: 8.8,
      matchReason: "Heartwarming historical journey"
    },
    {
      title: "Interstellar",
      year: 2014,
      genre: "Adventure, Drama, Sci-Fi",
      description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
      rating: 8.6,
      matchReason: "Epic space exploration with emotional depth"
    },
    {
      title: "The Lion King",
      year: 1994,
      genre: "Animation, Adventure, Drama",
      description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
      rating: 8.5,
      matchReason: "Iconic animated masterpiece"
    },
    {
      title: "La La Land",
      year: 2016,
      genre: "Comedy, Drama, Music",
      description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love.",
      rating: 8.0,
      matchReason: "Modern musical with stunning visuals"
    },
    {
      title: "Get Out",
      year: 2017,
      genre: "Horror, Mystery, Thriller",
      description: "A young African-American visits his white girlfriend's parents for the weekend.",
      rating: 7.7,
      matchReason: "Social thriller with clever commentary"
    },
    {
      title: "Spirited Away",
      year: 2001,
      genre: "Animation, Adventure, Family",
      description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods.",
      rating: 8.6,
      matchReason: "Magical animated fantasy"
    }
  ];

  // Define categories and keywords
  const categories = {
    action: ['action', 'fight', 'battle', 'war', 'superhero', 'martial'],
    scifi: ['sci-fi', 'science fiction', 'space', 'future', 'alien', 'robot', 'ai', 'time travel'],
    comedy: ['comedy', 'funny', 'humor', 'laugh', 'hilarious', 'sitcom'],
    drama: ['drama', 'emotional', 'serious', 'romance', 'love', 'relationship'],
    horror: ['horror', 'scary', 'terror', 'fright', 'ghost', 'monster'],
    thriller: ['thriller', 'suspense', 'mystery', 'crime', 'murder'],
    animation: ['animation', 'animated', 'cartoon', 'kids', 'family', 'disney'],
    classic: ['classic', 'old', 'vintage', '90s', '80s', 'retro']
  };

  // Find matching movies
  let matchedMovies = [];
  
  // Check each category
  Object.entries(categories).forEach(([category, keywords]) => {
    if (keywords.some(keyword => input.includes(keyword))) {
      const categoryMovies = allMovies.filter(movie => 
        movie.genre.toLowerCase().includes(category) || 
        movie.title.toLowerCase().includes(category)
      );
      matchedMovies = [...matchedMovies, ...categoryMovies];
    }
  });

  // If input contains specific movie titles or years
  allMovies.forEach(movie => {
    if (input.includes(movie.title.toLowerCase()) || 
        input.includes(movie.year.toString())) {
      matchedMovies.push(movie);
    }
  });

  // Remove duplicates
  matchedMovies = matchedMovies.filter((movie, index, self) =>
    index === self.findIndex(m => m.title === movie.title)
  );

  // If no specific matches, return random movies
  if (matchedMovies.length === 0) {
    matchedMovies = [...allMovies]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  } else {
    // Sort by rating for matched movies
    matchedMovies.sort((a, b) => b.rating - a.rating);
  }

  // Return 3-5 movies
  return matchedMovies.slice(0, 5);
}

// 🚀 START SERVER
const start = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    await fastify.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    
    console.log('🎬 ===========================================');
    console.log('🎬  MOVIE RECOMMENDATION API');
    console.log('🎬 ===========================================');
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`💡 POST to: http://localhost:${PORT}/recommend`);
    console.log('🎬 ===========================================');
    console.log('\n💡 Try these example queries:');
    console.log('   • "sci-fi movies about artificial intelligence"');
    console.log('   • "90s romantic comedies"');
    console.log('   • "psychological thrillers with plot twists"');
    console.log('   • "animated movies for adults"');
    console.log('   • "award-winning dramas"');
    console.log('🎬 ===========================================');
    
  } catch (err) {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  db.close();
  process.exit(0);
});

// Start the server
start();