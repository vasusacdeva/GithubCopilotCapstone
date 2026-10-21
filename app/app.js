(function () {
  var App = window.TodoApp;
  var form = document.getElementById('task-form');
  var input = document.getElementById('task-input');
  var message = document.getElementById('task-message');
  var list = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');
  var live = document.getElementById('live-region');

  var storage;
  try {
    storage = App.createStorage(window.localStorage);
  } catch (e) {
    // Accessing localStorage itself can throw (e.g. blocked storage).
    storage = App.createStorage({
      getItem: function () { throw e; },
      setItem: function () { throw e; }
    });
  }
  var store = new App.TaskStore(storage.load());

  function announce(text) {
    live.textContent = '';
    live.textContent = text;
  }

  function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
    announce(text);
  }

  function clearMessage() {
    message.textContent = '';
    message.hidden = true;
  }

  function buildItem(task) {
    var li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'toggle';
    checkbox.setAttribute('aria-label', 'Mark complete: ' + task.text);

    var span = document.createElement('span');
    span.className = 'text';
    span.textContent = task.text;

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete task: ' + task.text);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    return li;
  }

  function render() {
    var tasks = store.all();
    list.textContent = '';
    tasks.forEach(function (t) { list.appendChild(buildItem(t)); });
    emptyState.hidden = tasks.length > 0;
  }

  function persist() {
    storage.save(store.all());
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var task = store.add(input.value);
    if (!task) {
      var empty = input.value.trim() === '';
      showMessage(empty
        ? 'Task cannot be empty.'
        : 'Task must be 200 characters or fewer.');
      input.focus();
      return;
    }
    clearMessage();
    persist();
    render();
    input.value = '';
    input.focus();
    announce('Task added');
  });

  input.addEventListener('input', clearMessage);

  list.addEventListener('change', function (event) {
    var target = event.target;
    if (!target.classList.contains('toggle')) return;
    var li = target.closest('li');
    if (!li) return;
    store.toggle(li.dataset.id);
    persist();
    render();
    var again = list.querySelector('li[data-id="' + CSS.escape(li.dataset.id) + '"] .toggle');
    if (again) again.focus();
  });

  list.addEventListener('click', function (event) {
    var target = event.target;
    if (!target.classList.contains('delete')) return;
    var li = target.closest('li');
    if (!li) return;
    var next = li.nextElementSibling;
    var prev = li.previousElementSibling;
    var focusId = next ? next.dataset.id : (prev ? prev.dataset.id : null);
    store.remove(li.dataset.id);
    persist();
    render();
    announce('Task deleted');
    var focusEl = focusId
      ? list.querySelector('li[data-id="' + CSS.escape(focusId) + '"] .delete')
      : null;
    (focusEl || input).focus();
  });

  render();
})();
