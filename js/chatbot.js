document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  // Hardcoded API Key provided by user
  const apiKey = 'AIzaSyCI2wz2ZPKYXeLxfNi4ksd_b584PYHdNUE';

  const mood = getMood();
  if(mood) {
    appendMessage(`Hey there. I'm picking up that you're feeling **${mood}** today. I'm here to listen, what's on your mind?`, 'bot');
  }

  const chatHistory = [];

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const text = chatInput.value.trim();
    if(!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';
    chatHistory.push({ role: 'user', parts: [{ text }] });

    const loaderId = appendTypingIndicator();

    try {
      console.log('Sending message to AI companion...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: chatHistory })
      });

      removeLoader(loaderId);
      const data = await response.json();
      
      if(data.error) {
        appendMessage(`System note: ${data.error.message}`, 'bot');
      } else {
        const botReply = data.candidates[0].content.parts[0].text;
        console.log('Received response from AI');
        appendMessage(botReply, 'bot');
        chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
      }
    } catch(err) {
      console.error('Chat error:', err);
      removeLoader(loaderId);
      appendMessage('Sorry, I lost my connection to the network. Let\'s try again in a moment.', 'bot');
    }
  }

  function appendMessage(text, sender) {
    console.log(`Adding ${sender} message to chat`);
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    // Convert basic markdown to HTML
    let htmlText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="opacity:0.9;">$1</em>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = htmlText;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  }

  function appendTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.id = 'typing-' + Date.now();
    wrapper.className = 'typingindicator';
    wrapper.innerHTML = `
      <div class="typingdot"></div>
      <div class="typingdot"></div>
      <div class="typingdot"></div>
    `;
    chatBox.appendChild(wrapper);
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
    return wrapper.id;
  }

  function removeLoader(id) {
    const el = document.getElementById(id);
    if(el) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }
  }
});
