const addBtn = document.getElementById('add');

buildNotes();

addBtn.addEventListener('click', () => addNewNote())

async function addNewNote(noteData) {
    try {
        const { data } = await axios.post('/notes', {
            content: ''
        });
        if (data.note) {
            AddNoteHTML(data.note)
        }
        createNotification(data.message)
    } catch (err) {
        console.log(err)
    }
}

async function removeNote(id) {
    try {
        const { data } = await axios.delete(`/note/${id}`)

        createNotification( data.message )

        document.getElementById(id).remove()
    } catch (err) {
        console.log(err)
    }
}

async function updateNote(id, text) {
    try {
        const { data } = await axios.put(`/notes/${id}`, {
            content: text
        });
        if (data.note) {
            AddNoteHTML(data.note, true)
        }
        createNotification(data.message)
    } catch (err) {
        console.log(err)
    }
}

function AddNoteHTML(noteData, updating = false) {

    let note;

    if (updating) {
        note = document.getElementById(noteData._id)
    } else {
        note = document.createElement('div')
        note.classList.add('note')
        note.id = noteData._id
    }
    
    note.innerHTML = `
        <div class="tools">
            <span class="unsavedChanges">Unsaved Changes <i class="fas fa-chevron-right"></i></span>
            <button class="save"><i class="fas fa-save"></i></button>
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="main ${noteData.content ? "" : "hidden"}"></div>
        <textarea class="${noteData.content ? "hidden" : ""}"></textarea>
    `

    const editBtn = note.querySelector('.edit')
    const saveBtn = note.querySelector('.save')
    const deleteBtn = note.querySelector('.delete')
    const main = note.querySelector('.main')
    const textArea = note.querySelector('textarea')
    const unsavedChanges = note.querySelector('.unsavedChanges')

    textArea.value = noteData.content
    main.innerHTML = marked(noteData.content)

    deleteBtn.addEventListener('click', () => {
        removeNote(noteData._id)
    })

    saveBtn.addEventListener('click', () => {
        updateNote(noteData._id, textArea.value)
    })

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden')
        textArea.classList.toggle('hidden')
    })

    textArea.addEventListener('input', (e) => {
        const { value } = e.target

        if (value != main.innerHTML) {
            unsavedChanges.classList.add('active')
        } else {
            unsavedChanges.classList.remove('active')
        }

        main.innerHTML = marked(value)
    })

    if (!updating) {
        document.body.appendChild(note)
    }
}

async function buildNotes() {
    try {
        const { data } = await axios('/notes')

        if (data) {
            data.forEach(note => AddNoteHTML(note))
        }
    } catch (err) {
        console.log(err)
    }
}

function createNotification(message = null, type = null) {
    const notif = document.createElement('div')
    notif.classList.add('toast')
    notif.classList.add(type ? type : 'info')

    notif.innerText = message

    toasts.appendChild(notif)

    setTimeout(() => {
        notif.classList.add('remove')
    }, 2500)

    notif.addEventListener('transitionend', () => {
        notif.remove()
    })
}