document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('note-input');
  const saveBtn = document.getElementById('save-note-btn');
  const grid = document.getElementById('notes-grid');

  console.log('Journal loaded');

  saveBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if(text) {
      console.log('Saving new note...');
      const notes = JSON.parse(localStorage.getItem('moodify_notes')) || [];
      notes.push({ id: Date.now(), text, date: new Date().toLocaleString() });
      localStorage.setItem('moodify_notes', JSON.stringify(notes));
      noteInput.value = '';
      renderNotes();
    }
  });

  function renderNotes() {
    grid.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('moodify_notes')) || [];
    const favs = JSON.parse(localStorage.getItem('moodify_favs')) || [];

    const sortedNotes = notes.sort((a, b) => b.id - a.id);

    const allItems = [
      ...sortedNotes.map(n => ({ ...n, itemType: 'note' })),
      ...favs.map((f, i) => ({ id: `fav-${i}`, text: f, date: 'Favorited Item', itemType: 'fav' }))
    ];

    if(allItems.length === 0) {
      console.log('No archive items found');
      grid.innerHTML = '<p style="grid-column: 1 / -1; opacity: 0.7; text-align: center;">You have no saved notes or favorites yet.</p>';
      return;
    }

    console.log(`Rendering ${allItems.length} archive items`);

    allItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'contentcard';
      
      const desc = document.createElement('div');
      desc.className = 'carddesc';
      
      if(item.itemType === 'fav') {
        const parts = item.text.split(':');
        desc.innerHTML = `<strong>Saved ${parts[0]}</strong><br><br>${parts.slice(1).join(':')}`;
      } else {
        desc.innerHTML = `<strong>Note</strong><br><br>${item.text}`;
      }
      card.appendChild(desc);

      const dateStr = document.createElement('div');
      dateStr.style = 'font-size: 0.85rem; opacity: 0.6; margin-top: auto; margin-bottom: 15px; font-weight: 500;';
      dateStr.textContent = item.date;
      card.appendChild(dateStr);

      const delBtn = document.createElement('button');
      delBtn.className = 'favbtn';
      delBtn.style = 'color: #ffcccc; border-color: rgba(255,204,204,0.3); padding: 0.5rem 1rem; width: 100%; justify-content: center;';
      delBtn.innerHTML = 'Delete';
      delBtn.onclick = () => {
        console.log('Deleting item:', item.id);
        if(item.itemType === 'note') {
          let n = JSON.parse(localStorage.getItem('moodify_notes')) || [];
          n = n.filter(x => x.id !== item.id);
          localStorage.setItem('moodify_notes', JSON.stringify(n));
        } else {
          let f = JSON.parse(localStorage.getItem('moodify_favs')) || [];
          f = f.filter(x => x !== item.text);
          localStorage.setItem('moodify_favs', JSON.stringify(f));
        }
        renderNotes();
      };
      card.appendChild(delBtn);

      grid.appendChild(card);
    });
  }

  renderNotes();
});
