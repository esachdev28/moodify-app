// ========================================
// UTILS — shared helper functions
// ========================================

let MOODS= {
    happy: {color1: "#fdfcf0", color2: "#fbf9f5"},
    sad: {color1: "#f0f7f8", color2: "#fbf9f5"},
    stressed: {color1: "#f8f4f0", color2: "#fbf9f5"},
    chill: {color1: "#f5f5f5", color2: "#fbf9f5"}
}

// get/set mood from localStorage
function getMood(){
    return localStorage.getItem("moodify_mood")
}

function setMood(mood){
    localStorage.setItem("moodify_mood", mood)
}

// get/set intent from localStorage
function getIntent(){
    return localStorage.getItem("moodify_intent")
}

function setIntent(intent){
    localStorage.setItem("moodify_intent", intent)
}

// apply background colour based on mood
function applyMoodTheme(){
    let mood= getMood()
    if(mood && MOODS[mood]){
        let isDark= localStorage.getItem("moodify_theme")==="dark"
        if(!isDark){
            document.body.style.background= `linear-gradient(135deg, ${MOODS[mood].color1}, ${MOODS[mood].color2})`
        }
        console.log("Theme applied for mood:", mood)
    }
}

// get/set theme (dark or light)
function getTheme(){
    return localStorage.getItem("moodify_theme") || "light"
}

function setTheme(theme){
    localStorage.setItem("moodify_theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
    if(theme==="dark"){
        document.body.style.background= ""
    }
    else{
        applyMoodTheme()
    }
}

// toggle between dark and light mode
function toggleTheme(){
    let current= getTheme()
    let next= current==="dark" ? "light" : "dark"
    setTheme(next)
    updateThemeButton()
}

// update theme button icon
function updateThemeButton(){
    let btn= document.querySelector("#theme-toggle-btn")
    if(!btn) return
    let isDark= getTheme()==="dark"
    btn.innerHTML= isDark ? "☀️" : "🌙"
    btn.title= isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
}

// debounce function - delays execution
function debounce(fn, delay){
    delay= delay || 300
    let timer
    return function(...args){
        clearTimeout(timer)
        timer= setTimeout(()=> fn.apply(this, args), delay)
    }
}

// throttle function - limits execution rate
function throttle(fn, limit){
    limit= limit || 300
    let inThrottle= false
    return function(...args){
        if(!inThrottle){
            fn.apply(this, args)
            inThrottle= true
            setTimeout(()=>{ inThrottle= false }, limit)
        }
    }
}

// inject theme toggle button into navbar
function injectThemeToggle(){
    let navlinks= document.querySelector(".navlinks")
    if(!navlinks || document.querySelector("#theme-toggle-btn")) return

    let btn= document.createElement("button")
    btn.id= "theme-toggle-btn"
    btn.className= "theme-toggle"
    btn.setAttribute("aria-label", "Toggle dark mode")
    btn.addEventListener("click", toggleTheme)
    navlinks.appendChild(btn)
    updateThemeButton()
}

// apply saved theme on page load
document.addEventListener("DOMContentLoaded", ()=>{
    let savedTheme= getTheme()
    document.documentElement.setAttribute("data-theme", savedTheme)
    if(savedTheme!=="dark"){
        applyMoodTheme()
    }

    // add theme toggle button
    injectThemeToggle()
})
