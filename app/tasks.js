(function (root) {
  var MAX_LENGTH = 200;
  var counter = 0;

  function newId() {
    counter += 1;
    return Date.now().toString(36) + '-' + counter + '-' + Math.random().toString(36).slice(2, 8);
  }

  function addTask(tasks, text) {
    if (typeof text !== 'string') return tasks;
    var trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_LENGTH) return tasks;
    return tasks.concat([{ id: newId(), text: trimmed, completed: false, createdAt: Date.now() }]);
  }

  function toggleTask(tasks, id) {
    return tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, completed: !t.completed, createdAt: t.createdAt } : t;
    });
  }

  function removeTask(tasks, id) {
    return tasks.filter(function (t) { return t.id !== id; });
  }

  var api = { MAX_LENGTH: MAX_LENGTH, addTask: addTask, toggleTask: toggleTask, removeTask: removeTask };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Tasks = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
