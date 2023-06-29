
function isLocalStorageSupported() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  $(document).ready(function () {
    loadTasks();
  });
  
  function loadTasks() {
    if (isLocalStorageSupported()) {
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(function (task) {
        addTaskToList(task);
      });
    }
  }

  function saveTasks(tasks) {
    if (isLocalStorageSupported()) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  function addTaskToList(task) {
    var taskElement = $('<div class="task animate__animated animate__fadeIn">' + task + '<button type="button" class="btn btn-link btn-sm delete-task">Delete</button><button type="button" class="btn btn-link btn-sm edit-task">Edit</button></div>');
    $('#task-list').append(taskElement);
    toastr.success('Task added: ' + task);
  }

  $('#todo-form').submit(function (e) {
    e.preventDefault();
    var taskInput = $('#task');
    var task = taskInput.val().trim();
    if (task !== '') {
      addTaskToList(task);
      taskInput.val('');
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      saveTasks(tasks);
    }
  });

  $(document).on('click', '.delete-task', function () {
    var taskElement = $(this).parent();
    var task = taskElement.text();
    taskElement.remove();
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(function (t) {
      return t !== task;
    });
    saveTasks(tasks);
    toastr.error('Task deleted: ' + task);
  });


  $(document).on('click', '.edit-task', function () {
    var taskElement = $(this).parent();
    var task = taskElement.text().trim();
    var editedTask = prompt('Edit task:', task);
    if (editedTask !== null && editedTask.trim() !== '') {
      taskElement.text(editedTask);
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.map(function (t) {
        return t === task ? editedTask : t;
      });
      saveTasks(tasks);
      toastr.info('Task edited: ' + task + ' to ' + editedTask);
    }
  });


