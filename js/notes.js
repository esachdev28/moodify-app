// ========================================
// NOTES — journal section with localStorage
// ========================================

document.addEventListener("DOMContentLoaded", loadNotes)

function loadNotes(){
    let noteInput= document.querySelector("#note-input")
    let saveBtn= document.querySelector("#save-note-btn")
    let grid= document.querySelector("#notes-grid")

    console.log("Journal loaded")

    // throttled save to prevent double clicks
    let throttledSave= throttle(()=>{
        let text= noteInput.value.trim()
        if(text){
            console.log("Saving new note...")
            let notes= JSON.parse(localStorage.getItem("moodify_notes")) || []
            let mood= getMood() || "none"
            notes.push({
                id: Date.now(),
                text: text,
                date: new Date().toLocaleString(),
                mood: mood
            })
            localStorage.setItem("moodify_notes", JSON.stringify(notes))
            noteInput.value= ""
            renderNotes()
        }
    }, 500)

    saveBtn.addEventListener("click", throttledSave)

    // allow ctrl+enter to save
    noteInput.addEventListener("keydown", (event)=>{
        if(event.key==="Enter" && (event.ctrlKey || event.metaKey)){
            throttledSave()
        }
    })

    // render all notes and favorites
    function renderNotes(){
        grid.innerHTML= ""
        let notes= JSON.parse(localStorage.getItem("moodify_notes")) || []
        let favs= JSON.parse(localStorage.getItem("moodify_favs")) || []

        // sort notes newest first
        let sortedNotes= [...notes].sort((a, b)=> b.id - a.id)

        // combine notes and favs into one list
        let allItems= [
            ...sortedNotes.map((n)=> ({...n, itemType: "note"})),
            ...favs.map((f, i)=> ({id: `fav-${i}`, text: f, date: "Favorited Item", itemType: "fav"}))
        ]

        if(allItems.length===0){
            console.log("No archive items found")
            grid.innerHTML= '<p style="grid-column: 1 / -1; opacity: 0.7; text-align: center;">You have no saved notes or favorites yet.</p>'
            return
        }

        console.log(`Rendering ${allItems.length} archive items`)

        allItems.forEach((item)=>{
            let card= document.createElement("div")
            card.className= "contentcard"

            let desc= document.createElement("div")
            desc.className= "carddesc"

            if(item.itemType==="fav"){
                let parts= item.text.split(":")
                desc.innerHTML= `<strong>Saved ${parts[0]}</strong><br><br>${parts.slice(1).join(":")}`
            }
            else{
                let moodBadge= ""
                if(item.mood && item.mood!=="none"){
                    moodBadge= `<span style="display:inline-block; background: #884d27; color: #fff; padding: 0.2rem 0.7rem; border-radius: 8px; font-size: 0.8rem; margin-bottom: 0.8rem;">${item.mood}</span><br>`
                }
                desc.innerHTML= `<strong>Note</strong><br>${moodBadge}<br>${item.text}`
            }
            card.appendChild(desc)

            let dateStr= document.createElement("div")
            dateStr.style= "font-size: 0.85rem; opacity: 0.6; margin-top: auto; margin-bottom: 15px; font-weight: 500;"
            dateStr.textContent= item.date
            card.appendChild(dateStr)

            let delBtn= document.createElement("button")
            delBtn.className= "favbtn"
            delBtn.style= "color: #c0392b; border-color: rgba(192, 57, 43, 0.3); padding: 0.5rem 1rem; width: 100%; justify-content: center;"
            delBtn.innerHTML= "Delete"
            delBtn.onclick= ()=>{
                console.log("Deleting item:", item.id)
                if(item.itemType==="note"){
                    let n= JSON.parse(localStorage.getItem("moodify_notes")) || []
                    n= n.filter((x)=> x.id!==item.id)
                    localStorage.setItem("moodify_notes", JSON.stringify(n))
                }
                else{
                    let f= JSON.parse(localStorage.getItem("moodify_favs")) || []
                    f= f.filter((x)=> x!==item.text)
                    localStorage.setItem("moodify_favs", JSON.stringify(f))
                }
                renderNotes()
            }
            card.appendChild(delBtn)
            grid.appendChild(card)
        })
    }

    renderNotes()
}
