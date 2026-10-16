(function () {
  var form = document.getElementById('task-form');
  var input = document.getElementById('task-input');
  var list = document.getElementById('task-list');
  var emptyMessage = document.getElementById('empty-message');
  var storage = null;
  try { storage = window.localStorage; } catch (e) { storage = null; }

  var tasks = storage ? TaskStorage.loadTasks(storage) : [];

  function persist() {
    if (storage) TaskStorage.saveTasks(storage, tasks);
  }

  function trashIcon() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 12H7L6 9z');
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    return svg;
  }

  function render() {
    list.textContent = '';
    tasks.forEach(function (task) {
      var li = document.createElement('li');
      if (task.completed) li.className = 'completed';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark complete: ' + task.text);
      checkbox.addEventListener('change', function () {
        tasks = Tasks.toggleTask(tasks, task.id);
        persist();
        render();
      });

      var label = document.createElement('span');
      label.className = 'task-text';
      label.textContent = task.text;

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'delete';
      del.setAttribute('aria-label', 'Delete task: ' + task.text);
      del.appendChild(trashIcon());
      del.addEventListener('click', function () {
        tasks = Tasks.removeTask(tasks, task.id);
        persist();
        render();
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(del);
      list.appendChild(li);
    });
    emptyMessage.hidden = tasks.length > 0;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var updated = Tasks.addTask(tasks, input.value);
    if (updated === tasks) {
      input.focus();
      return;
    }
    tasks = updated;
    persist();
    render();
    input.value = '';
    input.focus();
  });

  render();
})();
