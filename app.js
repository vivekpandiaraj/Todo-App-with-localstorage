const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const filterBtns = document.querySelectorAll(".filters button");

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

let tasks = [];
let currentFilter = 'all';

function loadData() {
  const savedData = localStorage.getItem("todo-data");
  if (savedData) {
    try {
      tasks = JSON.parse(savedData);
    } catch (e) {
      tasks = [];
    }
  }
  renderTasks();
}

function renderTasks() {
  listContainer.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    let li = document.createElement("li");

    // If not editing, allow toggle completion
    if (!task.isEditing) {
      if (task.completed) {
        li.classList.add("checked");
      }
      li.onclick = (e) => {
        // Check if the click target is NOT the edit button or delete button
        if (!e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
          toggleTask(task.id);
        }
      };
    }

    // Render content based on editing state
    if (task.isEditing) {
      li.classList.add("editing");

      let editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;
      editInput.classList.add("edit-input");

      // Auto-focus the input
      setTimeout(() => editInput.focus(), 0);

      // Save on Enter
      editInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          saveEdit(task.id, editInput.value);
        }
      };

      // Save on Blur (clicking outside)
      editInput.onblur = () => {
        saveEdit(task.id, editInput.value);
      };

      li.appendChild(editInput);

    } else {
      let textSpan = document.createElement("span");
      textSpan.classList.add("task-text");
      textSpan.textContent = task.text;
      li.appendChild(textSpan);
    }

    // Action Buttons
    // Only show Edit button if not currently editing (though logic hides it via CSS usually)
    if (!task.isEditing) {
      let editBtn = document.createElement("span");
      editBtn.innerHTML = "&#9998;";
      editBtn.classList.add("edit-btn");
      editBtn.onclick = (e) => {
        e.stopPropagation();
        enableEditMode(task.id);
      };
      li.appendChild(editBtn);
    }

    // Always show delete button (or maybe hide during edit? Let's keep it)
    let deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7";
    deleteBtn.classList.add("delete-btn");
    // Use mousedown instead of onclick to prevent blur from firing first if we want strict control,
    // but standard click is usually fine.
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    };
    li.appendChild(deleteBtn);

    listContainer.appendChild(li);
  });

  saveData();
  updateFilterButtons();
}

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    const newTask = {
      id: Date.now(),
      text: inputBox.value,
      completed: false,
      isEditing: false
    };
    tasks.push(newTask);
    inputBox.value = "";
    renderTasks();
  }
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.isEditing) {
    task.completed = !task.completed;
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function enableEditMode(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    // Disable editing for all other tasks first
    tasks.forEach(t => t.isEditing = false);
    task.isEditing = true;
    renderTasks();
  }
}

function saveEdit(id, newText) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    if (newText.trim() !== "") {
      task.text = newText.trim();
    }
    task.isEditing = false;
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function updateFilterButtons() {
  filterBtns.forEach(btn => {
    if (btn.id === `filter-${currentFilter}`) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function clearCompleted() {
  if (confirm("Are you sure you want to delete all completed tasks?")) {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
  }
}

function saveData() {
  // We don't need to save 'isEditing' state permanently, but it's fine if we do.
  // It will reset on reload anyway because loadData renderTasks defaults to rendering what's there.
  // Actually, good practice to strip transient state, but simple stringify is okay for this app.
  // To be clean, we could map it, but let's keep it simple.
  localStorage.setItem("todo-data", JSON.stringify(tasks));
}

loadData();
