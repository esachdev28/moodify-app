const MOODS = {
  happy: { color1: '#fdfcf0', color2: '#fbf9f5' },
  sad: { color1: '#f0f7f8', color2: '#fbf9f5' },
  stressed: { color1: '#f8f4f0', color2: '#fbf9f5' },
  chill: { color1: '#f5f5f5', color2: '#fbf9f5' }
};

function getMood() {
  return localStorage.getItem('moodify_mood');
}

function setMood(mood) {
  localStorage.setItem('moodify_mood', mood);
}

function getIntent() {
  return localStorage.getItem('moodify_intent');
}

function setIntent(intent) {
  localStorage.setItem('moodify_intent', intent);
}

function applyMoodTheme() {
  const mood = getMood();
  if (mood && MOODS[mood]) {
    document.body.style.background = `linear-gradient(135deg, ${MOODS[mood].color1}, ${MOODS[mood].color2})`;
    console.log('Theme applied for mood:', mood);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyMoodTheme();
});
