const note_template = `
<div class="note" id="noteID{{ id }}">
    <div class="note-content" id="noteContent{{ id }}">{{ content }}
    </div>
    <div class="note-controls">
        <div class="note-control button delete" id="deleteNote{{ id }}">Xóa</div>
        <div class="note-control button edit" id="editNote{{ id }}">Chỉnh</div>
        <div class="note-control button save" id="saveNote{{ id }}">Lưu</div>
    </div>
</div>
`;

////////////////////////////////////////////////////////////
/// Get data from storage ///
////////////////////////////////////////////////////////////

const notes = JSON.parse(localStorage.getItem("notes")) || [];
const notes_node = document.querySelector("#notes");

for (const item of [...notes].reverse()) {
  if (item.id && item.content !== undefined) {
    let note = micromustache.render(note_template, {
      id: item.id,
      content: escape_entities(item.content),
    });
    notes_node.insertAdjacentHTML("beforeend", note);
  }
}

////////////////////////////////////////////////////////////
/// Event ///
////////////////////////////////////////////////////////////

document.querySelector("#create_note").addEventListener("click", () => {
  let note_data = {
    id: Date.now(),
    content: "",
  };
  notes.push(note_data);
  let note = micromustache.render(note_template, note_data);
  notes_node.insertAdjacentHTML("afterbegin", note);
  let note_node = document.getElementById("noteID" + note_data.id);
  note_node
    .querySelector(".note-controls .edit")
    .addEventListener("click", () => editNote(note_data.id));
  note_node
    .querySelector(".note-controls .save")
    .addEventListener("click", () => saveNote(note_data.id));
  note_node
    .querySelector(".note-controls .delete")
    .addEventListener("click", () => deleteNote(note_data.id));
  editNote(note_data.id);
});

document.querySelectorAll(".note-controls .edit").forEach((element) => {
  element.addEventListener("click", () => {
    id = getNoteID("editNote", element.id);
    editNote(id);
  });
});
document.querySelectorAll(".note-controls .save").forEach((element) => {
  element.addEventListener("click", () => {
    id = getNoteID("saveNote", element.id);
    saveNote(id);
  });
});
document.querySelectorAll(".note-controls .delete").forEach((element) => {
  element.addEventListener("click", () => {
    id = getNoteID("deleteNote", element.id);
    deleteNote(id);
  });
});

////////////////////////////////////////////////////////////
/// Function ///
////////////////////////////////////////////////////////////

function editNote(id) {
  const content_node = document.getElementById("noteContent" + id);
  const edit_node = document.getElementById("editNote" + id);
  const save_node = document.getElementById("saveNote" + id);

  content_node.contentEditable = true;
  edit_node.style.display = "none";
  save_node.style.display = "block";
}
function saveNote(id) {
  const content_node = document.getElementById("noteContent" + id);
  const edit_node = document.getElementById("editNote" + id);
  const save_node = document.getElementById("saveNote" + id);

  content_node.contentEditable = false;

  var content = content_node.innerText;
  let index = notes.findIndex((obj) => obj.id == id);
  if (index != -1) {
    notes[index].content = content;
  }
  updateNotesLocal();

  edit_node.style.display = "block";
  save_node.style.display = "none";
}
function deleteNote(id) {
  const note = document.getElementById("noteID" + id);
  note.remove();
  let index = notes.findIndex((obj) => obj.id == id);
  if (index != -1) {
    notes.splice(index, 1);
  }
  updateNotesLocal();
}

function getNoteID(prexix, string) {
  match = string.match(new RegExp(`^${prexix}(.+)`));
  if (match) return match[1];
  return false;
}

function escape_entities(str) {
  const char2entity = { "'": "&#39;", '"': "&quot;", "<": "&lt;", ">": "&gt;", "&": "&amp;" };
  let rv = "";
  for (let i = 0; i < str.length; i++) {
    let ch = str.charAt(i);
    rv += char2entity[ch] || ch;
  }
  return rv;
}

function updateNotesLocal() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
