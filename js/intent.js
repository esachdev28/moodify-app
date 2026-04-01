const intents = [
  { id: 'stay', label: 'Embrace it', desc: 'Find content that matches your current vibe.' },
  { id: 'change', label: 'Shift my mood', desc: 'Find content to help you feel different.' },
  { id: 'talk', label: 'I just want to talk', desc: 'Have a conversation with our AI companion.' }
];

document.addEventListener('DOMContentLoaded', () => {
  const mood = getMood();
  if(!mood) {
    window.location.href = 'index.html';
    return;
  }
  
  const subtitle = document.getElementById('intent-subtitle');
  subtitle.textContent = `You selected: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`;
  
  const grid = document.getElementById('intent-grid');
  console.log('User mood detected:', mood);
  
  intents.forEach((intent, index) => {
    const card = document.createElement('div');
    card.className = 'intentcard';
    card.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`;
    card.innerHTML = `
      <div class="cardtitle">${intent.label}</div>
      <div class="carddesc">${intent.desc}</div>
    `;
    card.addEventListener('click', () => {
      console.log('Intent selected:', intent.id);
      setIntent(intent.id);
      if (intent.id === 'talk') {
        window.location.href = 'chatbot.html';
      } else {
        window.location.href = 'content.html';
      }
    });
    grid.appendChild(card);
  });
});
