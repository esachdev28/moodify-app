// chatbot responses - JSON based structure
let chatbotData= [
    {
        keywords: ["sad", "unhappy", "down", "depressed", "crying", "upset", "grief", "miss", "low", "gloomy", "blue"],
        responses: [
            "I'm sorry you're feeling this way. 💙 Try listening to some **calming acoustic music** — it can really help. *\"The wound is the place where the light enters you.\"* — Rumi",
            "It's okay to feel sad sometimes. 🌧️ I'd suggest some **soothing lo-fi beats** and remember: *\"Every storm runs out of rain.\"*",
            "I hear you. 💛 How about some **mellow piano music**? Sometimes a gentle melody can be a warm hug for the soul. *\"This too shall pass.\"*",
            "Feeling down is normal — you're human. 💙 Try some **ambient nature sounds** and take a few deep breaths. You've got this.",
            "🎬 When I'm sad, a good movie helps. Try watching **Inside Out** or **The Pursuit of Happyness**. Sometimes a good cry is healing too.",
            "Here's something that might help: put on some **Coldplay** or **Bon Iver**, grab a blanket, and just let yourself feel. 💙 It's okay."
        ]
    },
    {
        keywords: ["happy", "great", "amazing", "wonderful", "excited", "joy", "awesome", "fantastic", "good", "excellent", "blessed"],
        responses: [
            "That's wonderful! 🎉 Keep the vibe going with some **upbeat dance tracks** — let the energy flow!",
            "Love to hear that! 🌟 How about some **fun pop songs** to match your mood? Dance it out!",
            "You're glowing! ✨ Try some **feel-good indie music** and keep riding that wave of happiness!",
            "Amazing! 🥳 Play some **party anthems** and celebrate the good times. You deserve it!",
            "*\"Happiness is not something ready made. It comes from your own actions.\"* — Dalai Lama 💛 Keep shining!",
            "🎬 Watch **The Secret Life of Walter Mitty** or put on some **Pharrell Williams** — match that happy energy! 🎶"
        ]
    },
    {
        keywords: ["stressed", "overwhelmed", "pressure", "worried", "tense", "burnout", "burned out", "overworked"],
        responses: [
            "Take a deep breath. 🧘 I recommend some **relaxing nature sounds** or **lo-fi beats**. *\"You don't have to see the whole staircase, just take the first step.\"*",
            "Stress is tough, but you're tougher. 💪 Try some **calm instrumental music** and maybe write in your journal. *\"Peace begins with a smile.\"* — Mother Teresa",
            "I feel you. 🌿 How about some **meditation music**? Close your eyes for 2 minutes and just breathe. You'll feel the difference.",
            "When stress hits, **ambient sounds** can ground you. 🎧 Try the spa or rain sounds on the Discover page. *\"Almost everything will work again if you unplug it for a few minutes.\"*",
            "🎬 Put on something light like **The Grand Budapest Hotel**. A good distraction can reset your brain. You'll be fine! 💛",
            "Take a step back. 🌿 Listen to some **Marconi Union - Weightless** — it's literally designed to reduce stress. Science says so!"
        ]
    },
    {
        keywords: ["anxious", "anxiety", "nervous", "panic", "panicking", "scared", "fear", "restless"],
        responses: [
            "I know anxiety can feel overwhelming. 💛 Try the 5-4-3-2-1 grounding technique — name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
            "You're safe right now. 🌿 Put on some **calming nature sounds** — ocean waves or rain. *\"Nothing diminishes anxiety faster than action.\"* — Walter Anderson",
            "Anxiety lies to you. 💙 It tells you things are worse than they are. Try some **deep breathing music** and remind yourself: you've survived 100% of your worst days.",
            "When anxiety hits, **box breathing** helps — breathe in 4 sec, hold 4 sec, out 4 sec, hold 4 sec. Repeat. 🧘 You'll feel calmer.",
            "🎬 Try watching **Soul** by Pixar — it's calming and gives beautiful perspective on life. Pair it with some **chamomile tea** 🍵",
            "You're not your anxious thoughts. 💛 Try journaling what you feel in the **Notes section** — getting it out of your head helps so much."
        ]
    },
    {
        keywords: ["angry", "mad", "furious", "frustrated", "rage", "annoyed", "irritated", "pissed"],
        responses: [
            "I understand that frustration. 🔥 Sometimes **heavy rock or intense beats** help channel that energy. Let it out!",
            "Anger is valid. Take a breath. 🌬️ Try some **fast-paced workout music** to burn off the tension, then switch to something calming.",
            "I get it. 😤 How about writing down what's bothering you in the **Notes section**? Then put on some **power anthems** and reset.",
            "*\"Holding on to anger is like drinking poison and expecting the other person to die.\"* — Buddha. 🌿 Let it go, put on some chill music.",
            "🎵 Try **Eminem** or **Linkin Park** — sometimes matching the energy helps you process it. Then cool down with lo-fi. 🎧",
            "Channel that fire! 🔥 Do 20 pushups, scream into a pillow, then put on some **calming instrumentals**. You'll feel so much lighter."
        ]
    },
    {
        keywords: ["lonely", "alone", "isolated", "no friends", "nobody", "no one", "left out", "invisible"],
        responses: [
            "You're not alone — I'm right here with you. 💛 *\"The greatest thing in the world is to know how to belong to oneself.\"* — Montaigne",
            "Loneliness is temporary, even when it doesn't feel like it. 🌅 Try listening to some **warm acoustic music** — it feels like a friend.",
            "I hear you. 💙 How about watching a feel-good movie like **Paddington** or **The Intouchables**? They remind you how beautiful connection is.",
            "🎵 Put on some **Ed Sheeran** or **John Mayer** — their music feels like a conversation with a friend. You matter more than you know.",
            "Write your feelings in the **Notes section**. 📝 Sometimes talking to yourself on paper is the first step to feeling connected again.",
            "Remember: being alone and being lonely are different things. 💛 Use this time to discover something new on the **Discover page**!"
        ]
    },
    {
        keywords: ["bored", "boring", "nothing to do", "meh", "blah", "dull"],
        responses: [
            "Bored? Let's fix that! 🎬 Check out the **Discover page** for movies and music curated just for you!",
            "Time to explore! 🌈 Try browsing some new genres on the Discover page — you might find your next obsession!",
            "Boredom is just untapped potential! ⚡ How about discovering a new film or writing a journal entry in Notes?",
            "🎵 Try a new music genre you've never listened to — K-pop, jazz, lo-fi, or Afrobeats! Life's too short for boring playlists.",
            "🎬 Watch **Everything Everywhere All at Once** — trust me, boredom will be the last thing you feel! 🍿"
        ]
    },
    {
        keywords: ["tired", "exhausted", "sleepy", "fatigue", "drained", "worn out", "no energy"],
        responses: [
            "Rest is important! 😴 Try some **soft ambient music** and let yourself unwind. You've earned it.",
            "Sounds like you need some downtime. 🌙 How about some **sleep-friendly lo-fi**? *\"Rest when you're weary. Refresh and renew yourself.\"*",
            "Take it easy. 💤 Some **calm nature sounds** might help you relax. Don't push too hard — tomorrow is a new day.",
            "Your body is telling you something. Listen to it. 🌿 Try **rain sounds** or **ocean waves** and just close your eyes for 10 minutes.",
            "🎵 Put on some **Norah Jones** or **Jack Johnson** — gentle, soothing, perfect for winding down. You deserve rest. 💛"
        ]
    },
    {
        keywords: ["love", "romantic", "crush", "relationship", "partner", "heart", "dating", "valentine"],
        responses: [
            "Love is in the air! 💕 How about some **romantic ballads** or a classic love movie from the Discover page?",
            "Aww! 💝 Let me suggest some **love songs** — head to Discover and let the vibes set the mood!",
            "That's beautiful! 🌹 Some **acoustic love songs** might be perfect right now. Enjoy the feeling!",
            "🎬 Watch **The Notebook** or **La La Land** — pair it with some rose tea and your favorite person. 💕",
            "🎵 Put on some **Bruno Mars** or **Adele** — nothing captures love like good music. *\"Love recognizes no barriers.\"* — Maya Angelou"
        ]
    },
    {
        keywords: ["breakup", "heartbreak", " my ex ", "broke up", "dumped", "moving on", "over it", "miss them"],
        responses: [
            "Heartbreak is one of the toughest things. 💔 But you WILL get through this. *\"The hottest love has the coldest end.\"* — Socrates",
            "It's okay to grieve what was. 🌧️ Put on some **Adele** or **Taylor Swift** — let the music hold you. Cry if you need to.",
            "🎬 Watch **Eternal Sunshine of the Spotless Mind** — it's about healing and acceptance. You're stronger than you think. 💛",
            "Time heals everything, I promise. 🌅 For now, listen to some **sad acoustic music**, write in your journal, and be gentle with yourself.",
            "You deserve someone who chooses you every single day. 💙 This ending is just making room for a better beginning.",
            "Block, delete, heal, glow. 💪 Put on a **workout playlist** and channel that pain into power. You've got this!"
        ]
    },
    {
        keywords: ["motivation", "motivated", "inspire", "push", "lazy", "unmotivated", "no motivation", "give up", "giving up"],
        responses: [
            "You've got this! 💪 *\"The only way to do great work is to love what you do.\"* — Steve Jobs. Put on an **energetic playlist** and go!",
            "🎵 Listen to **Eye of the Tiger** or **Lose Yourself by Eminem** — instant motivation boost! Now get up and conquer! 🔥",
            "Every master was once a disaster. 🌟 Start small — do ONE thing right now. Even a tiny step counts.",
            "🎬 Watch **Rocky** or **The Pursuit of Happyness** — if that doesn't fire you up, nothing will! *\"Believe you can and you're halfway there.\"*",
            "*\"It does not matter how slowly you go as long as you do not stop.\"* — Confucius. 🐢 Keep moving forward, one step at a time.",
            "Motivation comes AFTER you start, not before. 💛 Set a 5-minute timer and just begin. You'll surprise yourself."
        ]
    },
    {
        keywords: ["study", "exam", "exams", "test", "homework", "assignment", "school", "college", "class", "grades"],
        responses: [
            "Study time! 📚 Put on some **lo-fi hip hop beats** — they're literally made for studying. You'll thank me later!",
            "*\"The expert in anything was once a beginner.\"* 🌟 Break your study into 25-min chunks (Pomodoro technique) and crush it!",
            "🎵 Try **coffee shop ambient sounds** while studying — it tricks your brain into focus mode. ☕ You've got this!",
            "Exams don't define you, but preparation builds confidence. 💪 Make a quick plan, grab some water, and start with the easiest topic first.",
            "Struggling to focus? 📖 Put your phone on airplane mode, play **classical music**, and give yourself 45 focused minutes. Then reward yourself!",
            "Remember: smart study > long study. 🧠 Use active recall and spaced repetition. And take breaks — your brain needs them!"
        ]
    },
    {
        keywords: ["friend", "friendship", "friends", "bestie", "best friend", "toxic friend", "fake friends", "trust"],
        responses: [
            "Good friendships are gold. 💛 If someone drains your energy, it's okay to step back. *\"You are the average of the 5 people you spend the most time with.\"*",
            "🎵 Put on some **friendship vibes** — **Count on Me by Bruno Mars** is a classic! Real ones stick around. 💛",
            "Friendship drama is tough. 😔 But real friends show up when it matters. Give it time — the right people will stay.",
            "🎬 Watch **Toy Story** — it's literally about friendship through thick and thin. Sometimes the simplest lessons hit hardest.",
            "Not everyone who smiles at you is your friend, and that's okay. 🌿 Quality over quantity, always. Focus on the people who truly care.",
            "Missing your bestie? 💛 Send them a text right now! Don't wait — life is too short for \"I should've reached out.\""
        ]
    },
    {
        keywords: ["self doubt", "doubt", "not good enough", "imposter", "imposter syndrome", "insecure", "worthless", "useless"],
        responses: [
            "Stop that right there. 🛑 You ARE good enough. *\"You are braver than you believe, stronger than you seem, and smarter than you think.\"* — Winnie the Pooh",
            "Imposter syndrome is a liar. 💛 Every successful person has felt this way. The fact that you care means you're already doing great.",
            "🎵 Put on **Brave by Sara Bareilles** or **Fight Song** — let the music remind you of your strength! 💪",
            "Write down 3 things you're proud of in the **Notes section**. 📝 I bet you'll realize you're more amazing than you think.",
            "*\"No one can make you feel inferior without your consent.\"* — Eleanor Roosevelt. 🌟 Own your space. You belong here.",
            "🎬 Watch **The King's Speech** — it's about overcoming self-doubt and finding your voice. Powerful stuff. 💛"
        ]
    },
    {
        keywords: ["overthinking", "overthink", "thinking too much", "cant stop thinking", "racing thoughts", "spiral", "spiraling", "ruminating"],
        responses: [
            "Your brain is doing overtime! 🧠 Try this: write your thoughts down in the **Notes section** — getting them OUT of your head helps so much.",
            "Overthinking is like a rocking chair — it gives you something to do but gets you nowhere. 🌿 Put on some **calming music** and breathe.",
            "*\"Worrying does not take away tomorrow's troubles. It takes away today's peace.\"* 💛 Try some **guided meditation music** and be present.",
            "🎵 Put on some **lo-fi beats** and focus on the music instead. Sometimes your brain just needs a reset. 🎧",
            "The 5-5-5 rule helps: Will this matter in 5 days? 5 months? 5 years? If not, let it go. 🌅 Put on some chill vibes and relax.",
            "🎬 Watch **Soul** by Pixar — it beautifully shows how overthinking life makes us miss living it. 💙"
        ]
    },
    {
        keywords: ["confident", "confidence", "self esteem", "believe in myself", "bold", "strong", "powerful"],
        responses: [
            "YES! That energy! 🔥 Put on some **Beyoncé** or **Lizzo** and own your power! *\"You is kind. You is smart. You is important.\"*",
            "Confidence looks amazing on you! ✨ Keep that crown steady. 🎵 Try some **empowerment anthems** on the Discover page!",
            "🎬 Watch **Hidden Figures** — those women DEFINED confidence. Channel that energy! 💪",
            "*\"She believed she could, so she did.\"* 🌟 Whatever you're about to do — go crush it. You're unstoppable.",
            "🎵 Blast some **Dua Lipa** or **The Weeknd** — confidence deserves a soundtrack! Walk like you own the place! 💛"
        ]
    },
    {
        keywords: ["sleep", "insomnia", "cant sleep", "can't sleep", "awake", "nighttime", "restless night", "sleep issue"],
        responses: [
            "Can't sleep? 🌙 Try some **rain sounds** or **white noise** — they work wonders. Also, put your phone on night mode!",
            "🎵 Listen to **Weightless by Marconi Union** — it's scientifically proven to help you relax and sleep. 💤 Sweet dreams!",
            "Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 4 times. 🧘 Goodnight soon!",
            "*\"The best bridge between despair and hope is a good night's sleep.\"* 🌅 Put on some **ambient sleep music** and let go.",
            "Your mind is racing at night? 📝 Write down your thoughts in the **Notes section** before bed — it's like emptying your brain's cache. 💛",
            "🌙 No screens 30 min before bed (after this chat, of course 😉). Try **ocean waves** or **forest sounds** instead."
        ]
    },
    {
        keywords: ["productive", "productivity", "focus", "concentrate", "discipline", "routine", "habits", "hustle"],
        responses: [
            "Productivity mode ON! ⚡ Try the Pomodoro technique: 25 min work + 5 min break. Put on some **lo-fi beats** and crush it!",
            "🎵 **Coffee shop ambient sounds** are a cheat code for focus. Pair with a to-do list and you're unstoppable! ☕",
            "*\"The secret of getting ahead is getting started.\"* — Mark Twain. 💪 Start with the hardest task first — eat that frog!",
            "Try time-blocking your day. 📋 Write your 3 most important tasks in the **Notes section** and tackle them one by one.",
            "🎬 Watch **The Social Network** for some hustle inspiration — then channel that energy into YOUR work! 🔥",
            "Focus hack: put your phone in another room, play **instrumental music**, and set a timer. You'll be shocked how much you get done. 🧠"
        ]
    },
    {
        keywords: ["success", "goal", "goals", "dream", "dreams", "achieve", "achievement", "ambition", "future", "career"],
        responses: [
            "*\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"* — Churchill. 🌟 Keep going!",
            "Dream big, start small, act now! 🚀 Write your goals in the **Notes section** — making them visible is step one.",
            "🎵 Put on some **motivational beats** and visualize your success. Your future self will thank you! 💪",
            "🎬 Watch **The Pursuit of Happyness** — it'll remind you that every grind has a payoff. Stay patient, stay hungry. 🔥",
            "Every expert was once a beginner. 🌱 Celebrate your small wins — they add up to something incredible.",
            "*\"The only limit to our realization of tomorrow is our doubts of today.\"* — FDR. 💛 Believe in your journey!"
        ]
    },
    {
        keywords: ["music", "song", "listen", "play", "recommend", "playlist", "tune", "track"],
        responses: [
            "Great idea! 🎵 Head to the **Discover page** and I'll curate songs based on your mood!",
            "Music is medicine! 🎧 Go to **Discover → Soundscapes** to find tracks tailored just for you.",
            "I love music too! 🎶 Check the Discover page — there are fresh tracks waiting for your ears.",
            "🎵 Tell me your mood first and I can suggest the PERFECT genre for you! Happy? Sad? Stressed? Chill?",
            "Want a vibe check? 🎧 Head over to Discover — we've got everything from lo-fi to party anthems!"
        ]
    },
    {
        keywords: ["movie", "film", "watch", "cinema", "show", "series", "netflix", "binge"],
        responses: [
            "Movie time! 🎬 Head to the **Discover page** for mood-based film recommendations!",
            "A good movie can change everything! 🍿 Check out the **Cinematics section** on the Discover page.",
            "Let's find you the perfect film! 🎥 Go to **Discover** and browse the Cinematics collection.",
            "🎬 What genre you in the mood for? Action? Comedy? Drama? Tell me and I'll recommend something!",
            "Binge-watching night? 🍿 Head to Discover — we've got movies curated for your exact mood!"
        ]
    },
    {
        keywords: ["thank", "thanks", "appreciate", "grateful", "thx"],
        responses: [
            "You're welcome! 😊 I'm always here for you.",
            "Anytime! 💛 That's what I'm here for.",
            "Happy to help! 🌟 Don't hesitate to come back whenever you need.",
            "No worries at all! 💛 Take care of yourself, you deserve it.",
            "Glad I could help! 😊 Remember — I'm just a message away."
        ]
    },
    {
        keywords: ["bye", "goodbye", "see you", "later", "cya", "gotta go", "leaving", "good night"],
        responses: [
            "Take care! 👋 Remember, I'm always here when you need me.",
            "See you later! 🌈 Hope you feel awesome. Come back anytime!",
            "Bye for now! 💛 Wishing you a wonderful day ahead.",
            "Goodbye! 🌟 *\"Keep your face always toward the sunshine and shadows will fall behind you.\"* — Walt Whitman",
            "Good night! 🌙 Rest well and remember — tomorrow is a fresh start. 💛"
        ]
    },
    {
        keywords: ["help", "what can you do", "how does this work", "features", "guide"],
        responses: [
            "I can help you with a lot! 🛠️ Here's what I offer:\n• **Mood-based content** — songs, movies & quotes\n• **Journal** — write down your thoughts in Notes\n• **Favorites** — save items you love\n• **Dark mode** — toggle with the 🌙 button\nJust tell me how you're feeling! 😊",
            "I'm your mood companion! 🤖 Tell me how you feel and I'll suggest music, movies, and quotes. You can also:\n• Browse the **Discover** page\n• Write in your **Notes journal**\n• Toggle **dark/light mode**",
            "Here's how I work! 💛\n1. Tell me your mood (sad, happy, stressed, etc.)\n2. I'll suggest music, movies, and quotes\n3. Save your favorites on the Discover page\n4. Use Notes as your personal journal\nSimple as that! 😊"
        ]
    },
    {
        keywords: ["who are you", "your name", "what are you", "about you"],
        responses: [
            "I'm **Moodify's Chat Companion**! 🤖 I'm here to understand your mood and suggest music, movies, and quotes to help you feel your best.",
            "I'm your friendly mood assistant! 💛 I don't use any external AI — I'm built right into Moodify to help you instantly.",
            "I'm Moodify Bot! 🌟 Think of me as your digital bestie who always has the right playlist or movie recommendation ready. 😊"
        ]
    },
    {
        keywords: ["hi", "hello", "hey", "sup", "yo", "hola", "greetings", "howdy"],
        responses: [
            "Hey there! 👋 How are you doing today?",
            "Hello! So glad you're here. What's on your mind?",
            "Hi! I'm your mood companion. Tell me how you're feeling! 😊",
            "Hey! Welcome back to Moodify 💛 What's going on?",
            "Hola! Ready to vibe with you today. How's life treating you?"
        ]
    }
]

// fallback responses when no keyword matches
let defaultResponses= [
    "Interesting! Tell me more about how you're feeling. I can suggest music 🎵, movies 🎬, or just be here to listen.",
    "I'm here for you! Try telling me if you're feeling happy, sad, stressed, or anything else — I'll find the perfect content for you. 💛",
    "Hmm, I'm not sure I understood that. Try saying something like *\"I'm feeling stressed\"* or *\"recommend a movie\"* and I'll help! 😊",
    "I'd love to help! Share your mood or ask me about music, movies, or quotes and I'll guide you. 🌟",
    "Tell me more! 💛 I work best when you share your feelings — try saying *\"I feel sad\"* or *\"I need motivation\"*.",
    "I didn't quite get that, but I'm listening! 🎧 Tell me your mood and I'll suggest the perfect content for you."
]

// grab DOM elements and setup after page loads
let chatBox
let chatInput
let sendBtn

document.addEventListener("DOMContentLoaded", ()=>{
    chatBox= document.querySelector("#chat-box")
    chatInput= document.querySelector("#chat-input")
    sendBtn= document.querySelector("#send-btn")

    // show welcome message
    let mood= getMood()
    if(mood){
        appendMessage(`Hey there. I sense you're feeling **${mood}** today. I'm here to listen — what's on your mind?`, "bot")
    }
    else{
        appendMessage(`Hello! I'm your mood companion. Tell me how you're feeling and I'll suggest something for you. 💛`, "bot")
    }

    // send message on button click
    sendBtn.addEventListener("click", handleSend)

    // send message on enter key
    chatInput.addEventListener("keypress", (event)=>{
        if(event.key==="Enter"){
            handleSend()
        }
    })
})

// handle sending a message
function handleSend(){
    let text= chatInput.value.trim()
    if(!text) return

    appendMessage(text, "user")
    chatInput.value= ""

    let loaderId= showTypingDots()

    // small delay to feel natural
    let delay= 600 + Math.random() * 400
    setTimeout(()=>{
        removeTypingDots(loaderId)
        let reply= getReply(text)
        appendMessage(reply, "bot")
    }, delay)
}

// find matching response from chatbot data
function getReply(message){
    // add spaces around punctuation to easily find whole words
    let lower= " " + message.toLowerCase().replace(/[.,!?;:]/g, " ") + " "

    // find matching category using keywords
    let match= chatbotData.find((category)=>{
        return category.keywords.find((kw)=>{
            // check if kw is a whole word or exists in phrase
            return lower.includes(" " + kw.trim() + " ") || lower.includes(kw)
        })
    })

    // return random response from matched category
    if(match){
        let responses= match.responses
        let randomIndex= Math.floor(Math.random() * responses.length)
        return responses[randomIndex]
    }

    // no match found, return fallback
    let randomIndex= Math.floor(Math.random() * defaultResponses.length)
    return defaultResponses[randomIndex]
}

// add message to chat box
function appendMessage(text, sender){
    console.log(`Adding ${sender} message to chat`)
    let msgDiv= document.createElement("div")
    msgDiv.className= `message ${sender}`

    // convert basic markdown to html
    let htmlText= text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, '<em style="opacity:0.9;">$1</em>')
        .replace(/\n/g, "<br>")

    msgDiv.innerHTML= htmlText
    chatBox.appendChild(msgDiv)
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    })
}

// show typing dots animation
function showTypingDots(){
    let wrapper= document.createElement("div")
    wrapper.id= "typing-" + Date.now()
    wrapper.className= "typingindicator"
    wrapper.innerHTML= `
        <div class="typingdot"></div>
        <div class="typingdot"></div>
        <div class="typingdot"></div>
    `
    chatBox.appendChild(wrapper)
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    })
    return wrapper.id
}

// remove typing dots with fade animation
function removeTypingDots(id){
    let el= document.getElementById(id)
    if(el){
        el.style.opacity= "0"
        el.style.transform= "scale(0.9)"
        el.style.transition= "all 0.3s ease"
        setTimeout(()=> el.remove(), 300)
    }
}
