# Todo-App-with-localstorage

In this Repo let see how can we create Todo App with Local Storage which Save the user data with their browser only.
Note: This is for beginners and only used Basic Javascript.

## Features
- **Add Task**: Type in the box and press Enter or click 'Add'.
- **Mark as Done**: Click anywhere on the task card to toggle completion.
- **Edit**: Click the pencil icon to modify the text.
- **Delete**: Click the 'x' to remove a task.
- **Filters**: Quickly show All, Active, or Completed tasks.
- **Responsive**: Card-based UI that looks good on mobile and desktop.
- **Persistent**: All data is saved to your browser's Local Storage.

## Tech Stack
- HTML5
- CSS3 (Animations, Card UI)
- JavaScript (ES6, LocalStorage API)

## How It Works

### 1. Data Structure (JSON)
Instead of storing raw HTML, we store an array of objects in `localStorage`.
```json
[
  { 
    "id": 170664523, 
    "text": "Buy groceries", 
    "completed": false 
  },
  { 
    "id": 170664599, 
    "text": "Walk the dog", 
    "completed": true 
  }
]
```

### 2. State Management
The app maintains a global `tasks` array. Every time you add, edit, or delete a task:
1.  The `tasks` array is updated in JavaScript.
2.  The `saveData()` function converts this array to a JSON string and saves it to `localStorage`.
3.  The `renderTasks()` function wipes the current list and rebuilds the HTML from the `tasks` array.

### 3. Rendering Logic
We loop through the `tasks` array and create DOM elements (`li`, `span`, `button`) dynamically.
- **Event Listeners**: We attach `onclick` events directly to the elements when they are created. 
    - `li.onclick` handles the toggle (completion).
    - `editBtn.onclick` handles editing (with `stopPropagation` so it doesn't trigger the toggle).

### 4. Animations
CSS Keyframes (`@keyframes fadeIn`) are used to animate the tasks when they appear. The card layout uses `box-shadow` and `transform` on hover for a tactile feel.
