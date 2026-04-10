# 🎭 Moodify – Feel Better Instantly

> A mood-based web application that recommends movies, music, and quotes to brighten your day.

---

## 📖 Overview

**Moodify** is an interactive web application designed to uplift users through personalized content recommendations. Simply select your current mood — happy, sad, stressed, or more — and Moodify curates a tailored mix of movies, songs, and motivational quotes to help you feel better.

Beyond recommendations, users can save favorites, jot down personal notes, and chat with a built-in rule-based chatbot for an engaging, supportive experience.

---

## ✨ Features

- 🎭 **Mood-based recommendations** — Get content tailored to how you feel
- 🎵 **Music preview** — Listen to song snippets via the iTunes API
- 🎬 **Movie suggestions** — Discover films powered by the OMDB API
- 💬 **Rule-based chatbot** — Chat for mood support and guidance
- ❤️ **Favorites system** — Save and manage liked content (localStorage)
- 📝 **Notes section** — Write down personal thoughts and reflections
- 🌙 **Dark / Light mode** — Toggle between themes for comfort
- 🔍 **Search, Filter & Sort** — Find content quickly using Higher-Order Functions
- 📱 **Fully responsive design** — Works seamlessly on all devices

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, layout, and dark/light theming |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, Fetch API |

---

## 🔗 APIs Used

| API | Usage |
|-----|-------|
| [OMDB API](https://www.omdbapi.com/) | Fetching movie details and posters |
| [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) | Song search with 30-second audio previews |
| [ZenQuotes API](https://zenquotes.io/) | Displaying motivational and inspirational quotes |

---

## 📁 Project Structure

```
Moodify/
├── index.html            # Landing page – mood selection
├── intent.html            # Intent / mood confirmation page
├── content.html           # Recommendations display (movies, songs, quotes)
├── chatbot.html           # Rule-based chatbot interface
├── notes.html             # Personal notes section
├── styles/
│   └── style.css          # Global stylesheet with dark/light mode
├── js/
│   ├── index.js           # Landing page logic
│   ├── intent.js          # Intent handling logic
│   ├── content.js         # API calls, search, filter, sort, favorites
│   ├── chatbot.js         # Chatbot engine with rule-based responses
│   ├── notes.js           # Notes CRUD with localStorage
│   ├── utils.js           # Shared utility functions
│   └── config.example.js  # API key configuration template
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/moodify-app.git
   cd moodify-app
   ```

2. **Configure API keys**
   - Copy `js/config.example.js` to `js/config.js`
   - Add your OMDB API key inside `config.js`

3. **Run the application**
   - Open `index.html` in any modern browser
   - No build tools or server required

---

## 🌐 Live Demo

> 🔗 [https://your-deployed-link.vercel.app](https://your-deployed-link.vercel.app)
>
> *(Replace with your actual deployment URL)*

---

## 📸 Screenshots

> *Screenshots coming soon — add images of the landing page, recommendations view, chatbot, and dark mode here.*

---

## 🔮 Future Enhancements

- 🤖 AI-powered chatbot integration (OpenAI / Gemini)
- 🔐 User authentication and profiles
- 📊 Personalized dashboards with mood history
- 📱 Progressive Web App (PWA) support
- 🌍 Multi-language support
- 📈 Mood analytics and trends

---

## 👩‍💻 Author

**Ekta Sachdev**

---

## 📄 License

This project is built for educational purposes.

---

<p align="center">Made with ❤️ by Ekta Sachdev</p>