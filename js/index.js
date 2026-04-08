// mood options
let moods= [
    {id: "happy", label: "Happy"},
    {id: "sad", label: "Sad"},
    {id: "stressed", label: "Stressed"},
    {id: "chill", label: "Chill"}
]

document.addEventListener("DOMContentLoaded", loadMoods)

// render mood cards on page load
function loadMoods(){
    let grid= document.querySelector("#mood-grid")
    console.log("Loading moods...")

    moods.forEach((mood, index)=>{
        let card= document.createElement("div")
        card.className= `moodcard ${mood.id}`
        card.style.animation= `slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.1}s both`
        card.innerHTML= `<div class="cardtitle">${mood.label}</div>`

        card.addEventListener("click", ()=>{
            console.log("Setting mood to:", mood.id)
            setMood(mood.id)
            window.location.href= "intent.html"
        })
        grid.appendChild(card)
    })
}
