(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.TodoApp = root.TodoApp || {};
    root.TodoApp.TaskStore = api.TaskStore;
    root.TodoApp.validateTasks = api.validateTasks;
    root.TodoApp.MAX_LENGTH = api.MAX_LENGTH;
  }
})(typeof window !== 'undefined' ? window : null, function () {
  var MAX_LENGTH = 200;

  function validateTasks(value) {
    if (!Array.isArray(value)) return [];
    var seen = {};
    var result = [];
    value.forEach(function (item) {
      if (!item || typeof item !== 'object') return;
      if (typeof item.id !== 'string' || item.id === '' || seen[item.id]) return;
      if (typeof item.text !== 'string' || item.text.trim() === '' || item.text.length > MAX_LENGTH) return;
      if (typeof item.completed !== 'boolean') return;
      if (typeof item.createdAt !== 'number' || !isFinite(item.createdAt)) return;
      seen[item.id] = true;
      result.push({ id: item.id, text: item.text, completed: item.completed, createdAt: item.createdAt });
    });
    return result;
  }

  // cryptoImpl is injectable so the fallback path can be tested.
  function TaskStore(initial, cryptoImpl) {
    var crypto_ = cryptoImpl === undefined
      ? (typeof crypto !== 'undefined' ? crypto : null)
      : cryptoImpl;
    var tasks = validateTasks(initial);
    var counter = tasks.length;

    function nextId() {
      if (crypto_ && typeof crypto_.randomUUID === 'function') {
        return crypto_.randomUUID();
      }
      var id;
      do {
        counter += 1;
        id = 'task-' + Date.now().toString(36) + '-' + counter;
      } while (tasks.some(function (t) { return t.id === id; }));
      return id;
    }

    this.add = function (text) {
      if (typeof text !== 'string') return null;
      var trimmed = text.trim();
      if (trimmed === '' || trimmed.length > MAX_LENGTH) return null;
      var task = { id: nextId(), text: trimmed, completed: false, createdAt: Date.now() };
      tasks.unshift(task);
      return task;
    };

    this.toggle = function (id) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
          tasks[i].completed = !tasks[i].completed;
          return tasks[i];
        }
      }
      return null;
    };

    this.remove = function (id) {
      var before = tasks.length;
      tasks = tasks.filter(function (t) { return t.id !== id; });
      return tasks.length !== before;
    };

    this.all = function () {
      return tasks.map(function (t) {
        return { id: t.id, text: t.text, completed: t.completed, createdAt: t.createdAt };
      });
    };
  }

  return { TaskStore: TaskStore, validateTasks: validateTasks, MAX_LENGTH: MAX_LENGTH };
});
