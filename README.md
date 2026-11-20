# 🎭 Moodify – Feel Better Instantly

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://esachdev28.github.io/moodify-app/)
[![NPM Package](https://img.shields.io/badge/Powered%20by-winter--mode%20NPM%20package-blue.svg)](https://github.com/esachdev28/npm_package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A mood-based web application that recommends movies, music, and quotes to brighten your day, enhanced with an interactive winter snowfall experience powered by our custom NPM package.

---

## 🌐 Live Submission Links

| Component | Link | Status |
| :--- | :--- | :--- |
| **NPM Package Repository** | [https://github.com/esachdev28/npm_package](https://github.com/esachdev28/npm_package) | Public |
| **Demo Project Repository** | [https://github.com/esachdev28/moodify-app](https://github.com/esachdev28/moodify-app) | Public |
| **Live Deployed Application** | [https://esachdev28.github.io/moodify-app/](https://esachdev28.github.io/moodify-app/) | Live & Working |

---

## ❄️ Integrated NPM Package: `winter-mode`

Moodify integrates our custom NPM package **[`winter-mode`](https://github.com/esachdev28/npm_package)** to deliver a seasonal, ambient winter snowfall experience:

- **Installed as an NPM Dependency**:
  ```bash
  npm install github:esachdev28/npm_package
  ```
- **Interactive Snow Physics**: Falling snowflakes realistically settle and pile up on top of letters, headings, mood cards, and action buttons using canvas collision detection.
- **Interactive Hover Shake**: Moving your cursor over snowy elements knocks the snow off dynamically.
- **Navbar Toggle Button**: Seamlessly toggle the winter snow effect anytime using the **❄️ Winter Mode** button in the navbar.
- **Smart Mood Trigger**: Selecting the **"Chill"** mood automatically activates winter mode and creates a cozy, snowy atmosphere.
- **State Persistence**: Your winter mode preference is remembered across page navigations using `localStorage`.

---

## 📖 Overview

**Moodify** is an interactive web application designed to uplift users through personalized content recommendations. Simply select your current mood — happy, sad, stressed, or chill — and Moodify curates a tailored mix of movies, songs, and motivational quotes to help you feel better.

Beyond recommendations, users can save favorites, jot down personal notes, and chat with a built-in rule-based chatbot for an engaging, supportive experience.

---

## ✨ Features

- 🎭 **Mood-based recommendations** — Get content tailored to how you feel (Happy, Sad, Stressed, Chill)
- ❄️ **Interactive Winter Mode** — Realistic snowfall and snow piling via the `winter-mode` NPM package
- 🎵 **Music preview** — Listen to song snippets via the iTunes Search API
- 🎬 **Movie suggestions** — Discover films powered by the OMDB API
- 💬 **Rule-based chatbot** — Chat for mood support and guidance
- ❤️ **Favorites system** — Save and manage liked content (localStorage)
- 📝 **Notes section** — Write down personal thoughts and reflections
- 🌙 **Dark / Light mode** — Toggle between themes for comfort
- 🔍 **Search, Filter & Sort** — Find content quickly using Higher-Order Functions
- 📱 **Fully responsive design** — Works seamlessly on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, layout, and dark/light theming |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, Fetch API |
| **NPM Package (`winter-mode`)** | Canvas-based particle snowfall and letter-collision physics |
| **GitHub Pages** | Live web hosting and deployment |

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
moodify-app/
├── index.html            # Landing page – mood selection & winter toggle
├── intent.html           # Intent / mood confirmation page
├── content.html          # Recommendations display (movies, songs, quotes)
├── chatbot.html          # Rule-based chatbot interface
├── notes.html            # Personal notes section
├── package.json          # NPM configuration with winter-mode dependency
├── package-lock.json     # Dependency lockfile
├── styles/
│   └── style.css         # Global stylesheet with dark/light mode & winter button
├── js/
│   ├── index.js          # Landing page logic
│   ├── intent.js         # Intent handling logic
│   ├── content.js        # API calls, search, filter, sort, favorites
│   ├── chatbot.js        # Chatbot engine with rule-based responses
│   ├── notes.js          # Notes CRUD with localStorage
│   ├── utils.js          # Shared utility functions
│   ├── winter-mode.js    # Bundled NPM package engine
│   ├── winter-integration.js # Integration script for toggle & mood triggers
│   └── config.example.js # API key configuration template
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/esachdev28/moodify-app.git
cd moodify-app
```

### 2. Install dependencies (including our NPM package)
```bash
npm install
```

### 3. Run the application
```bash
npm start
```
Or simply open `index.html` in any modern web browser.

---

## 🌐 Live Deployed Application

- **Live URL**: [https://esachdev28.github.io/moodify-app/](https://esachdev28.github.io/moodify-app/)

---

## 👩‍💻 Author

**Ekta Sachdev**  
- GitHub: [@esachdev28](https://github.com/esachdev28)  
- Email: [esachdev5@gmail.com](mailto:esachdev5@gmail.com)  
- NPM Package: [winter-mode on GitHub](https://github.com/esachdev28/npm_package)

---

<p align="center">Made with ❤️ by Ekta Sachdev</p>
