// ========================================
// CONTENT — discover page logic
// movies (OMDB), songs (iTunes), quotes (ZenQuotes)
// search, filter, sort, pagination, favorites
// ========================================

// mood search terms for stay/change intent
let moodTerms= {
    happy: {stay: ["happy", "joy", "comedy", "upbeat", "dance"], change: ["calm", "relax", "chill", "ambient", "acoustic"]},
    sad: {stay: ["sad", "melancholy", "drama", "acoustic", "slow"], change: ["happy", "uplifting", "comedy", "dance", "party"]},
    stressed: {stay: ["intense", "thriller", "action", "fast"], change: ["calm", "relax", "nature", "lofi", "peace"]},
    chill: {stay: ["chill", "lofi", "relax", "ambient", "smooth"], change: ["energetic", "action", "dance", "upbeat", "party"]}
}

// state variables
let allSongs= []
let allMovies= []
let filteredSongs= []
let filteredMovies= []
let songPage= 1
let moviePage= 1
let ITEMS_PER_PAGE= 6

document.addEventListener("DOMContentLoaded", loadContent)

// main function to load all content
function loadContent(){
    let mood= getMood()
    let intent= getIntent()

    if(!mood || !intent){
        window.location.href= "index.html"
        return
    }

    console.log("Detected mood:", mood, "and intent:", intent)

    let subtitle= document.querySelector("#content-subtitle")
    if(subtitle){
        subtitle.textContent= `Curating the perfect blend for: ${mood.charAt(0).toUpperCase() + mood.slice(1)} • ${intent==="stay" ? "Embracing" : "Shifting"}`
    }

    let terms= moodTerms[mood][intent==="talk" ? "stay" : intent]
    let searchTerm= terms[Math.floor(Math.random() * terms.length)]
    console.log("Searching for vibe:", searchTerm)

    // add controls toolbar
    injectControls()

    loadQuotes()
    loadSongs(searchTerm)
    loadMovies(searchTerm)
}

// ========================================
// CONTROLS — search, filter, sort toolbar
// ========================================
function injectControls(){
    let discoveryHead= document.querySelector(".discoveryhead")
    if(!discoveryHead || document.querySelector("#controls-bar")) return

    let controlsBar= document.createElement("div")
    controlsBar.id= "controls-bar"
    controlsBar.className= "controls-bar"
    controlsBar.innerHTML= `
        <input type="text" id="search-input" placeholder="Search songs & movies..." autocomplete="off" />
        <select id="filter-type">
            <option value="all">All Types</option>
            <option value="song">Songs Only</option>
            <option value="movie">Movies Only</option>
        </select>
        <select id="sort-order">
            <option value="default">Default Order</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="year">Year (Movies)</option>
        </select>
    `
    discoveryHead.parentNode.insertBefore(controlsBar, discoveryHead.nextSibling)

    // debounced search
    let searchInput= document.querySelector("#search-input")
    let debouncedSearch= debounce(handleSearch, 300)
    searchInput.addEventListener("input", debouncedSearch)

    document.querySelector("#filter-type").addEventListener("change", handleFilter)
    document.querySelector("#sort-order").addEventListener("change", handleSort)
}

// ========================================
// SEARCH — filter results by query
// ========================================
function handleSearch(){
    let query= document.querySelector("#search-input").value.toLowerCase().trim()
    console.log("Searching for:", query)

    filteredSongs= allSongs.filter((song)=>{
        return song.trackName.toLowerCase().includes(query) || song.artistName.toLowerCase().includes(query)
    })

    filteredMovies= allMovies.filter((movie)=>{
        return movie.Title.toLowerCase().includes(query) || movie.Year.toLowerCase().includes(query)
    })

    songPage= 1
    moviePage= 1
    applyFilterAndSort()
}

// ========================================
// FILTER — by type (songs/movies/all)
// ========================================
function handleFilter(){
    applyFilterAndSort()
}

// ========================================
// SORT — alphabetical or by year
// ========================================
function handleSort(){
    applyFilterAndSort()
}

function applyFilterAndSort(){
    let filterType= document.querySelector("#filter-type").value
    let sortOrder= document.querySelector("#sort-order").value

    let songs= [...filteredSongs]
    let movies= [...filteredMovies]

    // sort
    if(sortOrder==="az"){
        songs= songs.sort((a, b)=> a.trackName.localeCompare(b.trackName))
        movies= movies.sort((a, b)=> a.Title.localeCompare(b.Title))
    }
    else if(sortOrder==="za"){
        songs= songs.sort((a, b)=> b.trackName.localeCompare(a.trackName))
        movies= movies.sort((a, b)=> b.Title.localeCompare(a.Title))
    }
    else if(sortOrder==="year"){
        movies= movies.sort((a, b)=> parseInt(b.Year) - parseInt(a.Year))
    }

    // filter visibility
    let songsSection= document.querySelector(".soundscapes-section")
    let moviesSection= document.querySelector(".cinematics-section")

    if(songsSection) songsSection.style.display= (filterType==="movie") ? "none" : ""
    if(moviesSection) moviesSection.style.display= (filterType==="song") ? "none" : ""

    if(filterType!=="movie"){
        songPage= 1
        renderSongs(songs)
    }
    if(filterType!=="song"){
        moviePage= 1
        renderMovies(movies)
    }
}

// ========================================
// RENDER SONGS — with pagination
// ========================================
function renderSongs(songs){
    let grid= document.querySelector("#songs-grid")
    if(!grid) return
    grid.innerHTML= ""
    grid.style.gridTemplateColumns= "repeat(auto-fit, minmax(320px, 1fr))"

    if(songs.length===0){
        grid.innerHTML= '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.6; padding: 2rem;">No songs match your search.</p>'
        return
    }

    let totalPages= Math.ceil(songs.length / ITEMS_PER_PAGE)
    let start= (songPage - 1) * ITEMS_PER_PAGE
    let paginated= songs.slice(start, start + ITEMS_PER_PAGE)

    paginated.forEach((song, idx)=>{
        let card= document.createElement("div")
        card.className= "contentcard"
        card.style.animation= `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(idx + 1) * 0.1}s both`

        let isFav= isFavorite("song", song.trackName)
        let imgUrl= song.artworkUrl100 ? song.artworkUrl100.replace("100x100", "600x600") : "https://via.placeholder.com/600?text=No+Cover"

        card.innerHTML= `
            <img src="${imgUrl}" alt="Cover" class="cardmedia">
            <div class="cardtitle">${song.trackName}</div>
            <div class="carddesc">${song.artistName}</div>
            <audio controls src="${song.previewUrl}" style="margin-bottom: 1.5rem; width: 100%;"></audio>
            <button class="favbtn ${isFav ? "active" : ""}" onclick="toggleFav(this, 'song', '${song.trackName.replace(/'/g, "\\'")}')">
                ${isFav ? "Added to Library" : "Save Audio"}
            </button>
        `
        grid.appendChild(card)
    })

    // pagination controls
    if(totalPages > 1){
        let paginationDiv= document.createElement("div")
        paginationDiv.className= "pagination-controls"
        paginationDiv.innerHTML= `
            <button class="pagination-btn" ${songPage <= 1 ? "disabled" : ""} onclick="changeSongPage(-1)">← Prev</button>
            <span class="pagination-info">Page ${songPage} of ${totalPages}</span>
            <button class="pagination-btn" ${songPage >= totalPages ? "disabled" : ""} onclick="changeSongPage(1)">Next →</button>
        `
        grid.parentNode.appendChild(paginationDiv)
    }

    // remove old pagination if duplicate
    let oldPag= grid.parentNode.querySelectorAll(".pagination-controls")
    if(oldPag.length > 1){
        oldPag.item(0).remove()
    }
}

// change song page
window.changeSongPage= function(dir){
    songPage+= dir
    applyFilterAndSort()
}

// ========================================
// RENDER MOVIES — with pagination
// ========================================
function renderMovies(movies){
    let grid= document.querySelector("#movies-grid")
    if(!grid) return
    grid.innerHTML= ""

    if(movies.length===0){
        grid.innerHTML= '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.6; padding: 2rem;">No movies match your search.</p>'
        return
    }

    let totalPages= Math.ceil(movies.length / ITEMS_PER_PAGE)
    let start= (moviePage - 1) * ITEMS_PER_PAGE
    let paginated= movies.slice(start, start + ITEMS_PER_PAGE)

    paginated.forEach((movie, idx)=>{
        let card= document.createElement("div")
        card.className= "contentcard"
        card.style.animation= `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(idx + 2) * 0.1}s both`

        let isFav= isFavorite("movie", movie.Title)

        card.innerHTML= `
            <img src="${movie.Poster!=="N/A" ? movie.Poster : "https://via.placeholder.com/600x900?text=No+Poster"}" alt="Poster" class="cardmedia">
            <div class="cardtitle">${movie.Title}</div>
            <div class="carddesc">Year: ${movie.Year}</div>
            <button class="favbtn ${isFav ? "active" : ""}" onclick="toggleFav(this, 'movie', '${movie.Title.replace(/'/g, "\\'")}')">
                ${isFav ? "Saved Movie" : "Bookmark Movie"}
            </button>
        `
        grid.appendChild(card)
    })

    // pagination controls
    if(totalPages > 1){
        let paginationDiv= document.createElement("div")
        paginationDiv.className= "pagination-controls"
        paginationDiv.innerHTML= `
            <button class="pagination-btn" ${moviePage <= 1 ? "disabled" : ""} onclick="changeMoviePage(-1)">← Prev</button>
            <span class="pagination-info">Page ${moviePage} of ${totalPages}</span>
            <button class="pagination-btn" ${moviePage >= totalPages ? "disabled" : ""} onclick="changeMoviePage(1)">Next →</button>
        `
        grid.parentNode.appendChild(paginationDiv)
    }

    // remove old pagination if duplicate
    let oldPag= grid.parentNode.querySelectorAll(".pagination-controls")
    if(oldPag.length > 1){
        oldPag.item(0).remove()
    }
}

// change movie page
window.changeMoviePage= function(dir){
    moviePage+= dir
    applyFilterAndSort()
}

// ========================================
// API — fetch quotes
// ========================================
async function loadQuotes(){
    let loader= document.querySelector("#songs-loader")
    let error= document.querySelector("#songs-error")
    let grid= document.querySelector("#songs-grid")

    if(!loader || !error || !grid) return

    console.log("Loading quotes...")
    loader.classList.remove("hidden")
    error.classList.add("hidden")
    grid.innerHTML= ""

    try{
        let response= await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent("https://zenquotes.io/api/random")}&cb=${Date.now()}`)
        if(!response.ok) throw new Error("Failed to fetch")
        let data= await response.json()
        let quotes= JSON.parse(data.contents)

        loader.classList.add("hidden")

        grid.style.gridTemplateColumns= "1fr"

        quotes.forEach((q, idx)=>{
            let card= document.createElement("div")
            card.className= "contentcard"
            card.style.animation= `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s both`
            card.style.textAlign= "center"
            card.style.alignItems= "center"
            card.style.padding= "3rem 2rem"

            let isFav= isFavorite("quote", q.q)

            card.innerHTML= `
                <div class="carddesc" style="font-size: 1.8rem; font-family: 'Newsreader', serif; font-weight: 500; color: #1b1c1a; line-height: 1.4;">"${q.q}"</div>
                <div class="cardtitle" style="font-size: 1.2rem; opacity:0.7; margin-bottom: 2rem;">— ${q.a}</div>
                <button class="favbtn ${isFav ? "active" : ""}" style="max-width:200px;" onclick="toggleFav(this, 'quote', '${q.q.replace(/'/g, "\\'")}')">
                    ${isFav ? "Saved to Journal" : "Save this Quote"}
                </button>
            `
            grid.appendChild(card)
        })
    }
    catch(err){
        console.error("Quote fetch error:", err)
        loader.classList.add("hidden")
        error.textContent= "Oops! Failed to pull the latest inspiration."
        error.classList.remove("hidden")
    }
}

// ========================================
// API — fetch songs (iTunes)
// ========================================
async function loadSongs(term){
    let loader= document.querySelector("#songs-loader")
    let error= document.querySelector("#songs-error")
    let grid= document.querySelector("#songs-grid")

    if(!loader || !error || !grid) return

    console.log("Fetching songs for:", term)
    loader.classList.remove("hidden")
    error.classList.add("hidden")

    try{
        let musicTerm= Math.random() < 0.3 ? term : term + " music"
        let response= await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(musicTerm)}&media=music&limit=18`)
        if(!response.ok) throw new Error("Failed to fetch")
        let data= await response.json()

        loader.classList.add("hidden")

        if(data.results.length===0){
            error.textContent= "No songs found for your vibe. Try again!"
            error.classList.remove("hidden")
            return
        }

        allSongs= data.results
        filteredSongs= [...allSongs]
        songPage= 1
        renderSongs(filteredSongs)
    }
    catch(err){
        console.error("Songs fetch error:", err)
        loader.classList.add("hidden")
        error.textContent= "Oops! Failed to load music data. Please try again."
        error.classList.remove("hidden")
    }
}

// ========================================
// API — fetch movies (OMDB)
// uses s= for search (NOT t=)
// ========================================
async function loadMovies(term){
    let loader= document.querySelector("#movies-loader")
    let error= document.querySelector("#movies-error")
    let grid= document.querySelector("#movies-grid")

    if(!loader || !error || !grid) return

    console.log("Fetching movies for:", term)
    let apiKey= (typeof CONFIG!=="undefined") ? CONFIG.OMDB_API_KEY : "8e938c62"

    loader.classList.remove("hidden")
    error.classList.add("hidden")
    grid.innerHTML= ""

    try{
        // use s= for search (NOT t=)
        let url= `https://www.omdbapi.com/?s=${encodeURIComponent(term)}&type=movie&apikey=${apiKey}`
        console.log("OMDB URL:", url)

        let response= await fetch(url)
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        let data= await response.json()

        loader.classList.add("hidden")

        // handle OMDB "False" response
        if(data.Response==="False"){
            console.warn("OMDB returned False:", data.Error)

            // fallback search term
            let fallbackTerms= ["comedy", "adventure", "drama", "action", "thriller"]
            let fallback= fallbackTerms[Math.floor(Math.random() * fallbackTerms.length)]
            console.log("Retrying with fallback term:", fallback)

            let retryResponse= await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(fallback)}&type=movie&apikey=${apiKey}`)
            let retryData= await retryResponse.json()

            if(retryData.Response==="False"){
                error.textContent= "No movies found. Try selecting a different mood!"
                error.classList.remove("hidden")
                return
            }

            allMovies= retryData.Search || []
        }
        else{
            allMovies= data.Search || []
        }

        filteredMovies= [...allMovies]
        moviePage= 1
        renderMovies(filteredMovies)
    }
    catch(err){
        console.error("Movies fetch error:", err)
        loader.classList.add("hidden")
        error.textContent= "Oops! Cinema network failed to respond. Please check your connection and try again."
        error.classList.remove("hidden")
    }
}

// ========================================
// FAVORITES — localStorage
// ========================================

// check if item is in favorites
function isFavorite(type, item){
    let favs= JSON.parse(localStorage.getItem("moodify_favs")) || []
    return favs.includes(`${type}: ${item}`)
}

// toggle favorite on/off
window.toggleFav= function(btn, type, item){
    let favs= JSON.parse(localStorage.getItem("moodify_favs")) || []
    let entry= `${type}: ${item}`

    if(favs.includes(entry)){
        favs= favs.filter((f)=> f!==entry)
        btn.classList.remove("active")
        btn.innerHTML= type==="quote" ? "Save this Quote" : type==="song" ? "Save Audio" : "Bookmark Movie"
    }
    else{
        favs.push(entry)
        btn.classList.add("active")
        btn.innerHTML= type==="quote" ? "Saved to Journal" : type==="song" ? "Added to Library" : "Saved Movie"
    }

    localStorage.setItem("moodify_favs", JSON.stringify(favs))
}
