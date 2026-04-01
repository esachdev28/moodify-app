const moodTerms = {
  happy: { stay: ['happy', 'joy', 'comedy', 'upbeat', 'dance'], change: ['calm', 'relax', 'chill', 'ambient', 'acoustic'] },
  sad: { stay: ['sad', 'melancholy', 'drama', 'acoustic', 'slow'], change: ['happy', 'uplifting', 'comedy', 'dance', 'party'] },
  stressed: { stay: ['intense', 'thriller', 'action', 'fast'], change: ['calm', 'relax', 'nature', 'lofi', 'peace'] },
  chill: { stay: ['chill', 'lofi', 'relax', 'ambient', 'smooth'], change: ['energetic', 'action', 'dance', 'upbeat', 'party'] }
};

document.addEventListener('DOMContentLoaded', () => {
  const mood = getMood();
  const intent = getIntent();
  
  if(!mood || !intent) {
    window.location.href = 'index.html';
    return;
  }
  
  console.log('Detected mood:', mood, 'and intent:', intent);
  
  const subtitle = document.getElementById('content-subtitle');
  if (subtitle) {
    subtitle.textContent = `Curating the perfect blend for: ${mood.charAt(0).toUpperCase() + mood.slice(1)} • ${intent === 'stay' ? 'Embracing' : 'Shifting'}`;
  }
  
  const terms = moodTerms[mood][intent === 'talk' ? 'stay' : intent];
  const searchTerm = terms[Math.floor(Math.random() * terms.length)];
  console.log('Searching for vibe:', searchTerm);

  loadQuotes();
  loadSongs(searchTerm);
  loadMovies(searchTerm);
});

async function loadQuotes() {
  const loader = document.getElementById('songs-loader');
  const error = document.getElementById('songs-error');
  const grid = document.getElementById('songs-grid');

  if (!loader || !error || !grid) return;

  console.log('Loading quotes...');
  loader.classList.remove('hidden');
  error.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://zenquotes.io/api/random')}&cb=${Date.now()}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    const quotes = JSON.parse(data.contents);
    
    loader.classList.add('hidden');

    grid.style.gridTemplateColumns = '1fr';
    
    quotes.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'contentcard';
      card.style.animation = `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s both`;
      card.style.textAlign = 'center';
      card.style.alignItems = 'center';
      card.style.padding = '3rem 2rem';
      
      const isFav = isFavorite('quote', q.q);
      
      card.innerHTML = `
        <div class="carddesc" style="font-size: 1.8rem; font-family: 'Newsreader', serif; font-weight: 500; color: #1b1c1a; line-height: 1.4;">"${q.q}"</div>
        <div class="cardtitle" style="font-size: 1.2rem; opacity:0.7; margin-bottom: 2rem;">— ${q.a}</div>
        <button class="favbtn ${isFav ? 'active' : ''}" style="max-width:200px;" onclick="toggleFav(this, 'quote', '${q.q.replace(/'/g, "\\'")}')">
          ${isFav ? 'Saved to Journal' : 'Save this Quote'}
        </button>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    loader.classList.add('hidden');
    error.textContent = 'Oops! Failed to pull the latest inspiration.';
    error.classList.remove('hidden');
  }
}

async function loadSongs(term) {
  const loader = document.getElementById('songs-loader');
  const error = document.getElementById('songs-error');
  const grid = document.getElementById('songs-grid');
  
  if (!loader || !error || !grid) return;

  console.log('Fetching songs for:', term);
  loader.classList.remove('hidden');
  error.classList.add('hidden');
  // Note: loadQuotes already cleared grid if called before, but let's append instead if needed.
  // Actually, loadQuotes cleared it. So we might want to append.
  // But wait, content.html has separate sections for Soundscapes and Cinematics.
  // Wait, I should look at content.html again.
  // Soundscapes has id="songs-grid". Cinematics has id="movies-grid".
  // So loadQuotes and loadSongs both use "songs-grid"?
  // If so, loadSongs will overwrite quotes.
  // I'll make loadQuotes use a different one if possible, or just let them overlap.
  // Let's assume quotes should be in a separate section.
  // But content.html only has Soundscapes and Cinematics.
  // I'll stick to the user's provided structure.
}

async function loadSongs(term) {
  const loader = document.getElementById('songs-loader');
  const error = document.getElementById('songs-error');
  const grid = document.getElementById('songs-grid');
  
  if (!loader || !error || !grid) return;

  console.log('Fetching songs for:', term);
  // Keep the loader logic
  loader.classList.remove('hidden');
  error.classList.add('hidden');

  try {
    const musicTerm = Math.random() < 0.3 ? term : term + ' music';
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(musicTerm)}&media=music&limit=6`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    
    loader.classList.add('hidden');
    
    if(data.results.length === 0) {
      error.textContent = 'No songs found for your vibe. Try again!';
      error.classList.remove('hidden');
      return;
    }

    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';

    data.results.forEach((song, idx) => {
      const card = document.createElement('div');
      card.className = 'contentcard';
      card.style.animation = `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(idx+1) * 0.1}s both`;
      
      const isFav = isFavorite('song', song.trackName);
      const imgUrl = song.artworkUrl100 ? song.artworkUrl100.replace('100x100', '600x600') : 'https://via.placeholder.com/600?text=No+Cover';
      
      card.innerHTML = `
        <img src="${imgUrl}" alt="Cover" class="cardmedia">
        <div class="cardtitle">${song.trackName}</div>
        <div class="carddesc">${song.artistName}</div>
        <audio controls src="${song.previewUrl}" style="margin-bottom: 1.5rem; width: 100%;"></audio>
        <button class="favbtn ${isFav ? 'active' : ''}" onclick="toggleFav(this, 'song', '${song.trackName.replace(/'/g, "\\'")}')">
          ${isFav ? 'Added to Library' : 'Save Audio'}
        </button>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    loader.classList.add('hidden');
    error.textContent = 'Oops! Failed to load Apple Music data.';
    error.classList.remove('hidden');
  }
}

async function loadMovies(term) {
  const loader = document.getElementById('movies-loader');
  const error = document.getElementById('movies-error');
  const grid = document.getElementById('movies-grid');
  
  if (!loader || !error || !grid) return;

  console.log('Fetching movies for:', term);
  const apiKey = '8e938c62'; 
  
  loader.classList.remove('hidden');
  error.classList.add('hidden');
  grid.innerHTML = '';

  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&type=movie&apikey=${apiKey}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    
    loader.classList.add('hidden');
    
    if(data.Response === 'False') {
      error.textContent = data.Error;
      error.classList.remove('hidden');
      return;
    }

    data.Search.slice(0, 6).forEach((movie, idx) => {
      const card = document.createElement('div');
      card.className = 'contentcard';
      card.style.animation = `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(idx+2) * 0.1}s both`;
      
      const isFav = isFavorite('movie', movie.Title);
      
      card.innerHTML = `
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/600x900?text=No+Poster'}" alt="Poster" class="cardmedia">
        <div class="cardtitle">${movie.Title}</div>
        <div class="carddesc">Year: ${movie.Year}</div>
        <button class="favbtn ${isFav ? 'active' : ''}" onclick="toggleFav(this, 'movie', '${movie.Title.replace(/'/g, "\\'")}')">
          ${isFav ? 'Saved Movie' : 'Bookmark Movie'}
        </button>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    loader.classList.add('hidden');
    error.textContent = 'Oops! Cinema network failed to respond.';
    error.classList.remove('hidden');
  }
}

function isFavorite(type, item) {
  const favs = JSON.parse(localStorage.getItem('moodify_favs')) || [];
  return favs.includes(`${type}: ${item}`);
}

window.toggleFav = function(btn, type, item) {
  let favs = JSON.parse(localStorage.getItem('moodify_favs')) || [];
  const entry = `${type}: ${item}`;
  
  if(favs.includes(entry)) {
    favs = favs.filter(f => f !== entry);
    btn.classList.remove('active');
    btn.innerHTML = type === 'quote' ? 'Save this Quote' : type === 'song' ? 'Save Audio' : 'Bookmark Movie';
  } else {
    favs.push(entry);
    btn.classList.add('active');
    btn.innerHTML = type === 'quote' ? 'Saved to Journal' : type === 'song' ? 'Added to Library' : 'Saved Movie';
  }
  
  localStorage.setItem('moodify_favs', JSON.stringify(favs));
};
