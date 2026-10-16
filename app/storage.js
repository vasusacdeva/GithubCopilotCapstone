(function (root) {
  var KEY = 'kan116.tasks';

  function isValidTask(t) {
    return t !== null && typeof t === 'object' &&
      typeof t.id === 'string' && typeof t.text === 'string' && typeof t.completed === 'boolean';
  }

  function loadTasks(storage) {
    try {
      var raw = storage.getItem(KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data) || !data.every(isValidTask)) return [];
      return data;
    } catch (e) {
      return [];
    }
  }

  function saveTasks(storage, tasks) {
    try {
      storage.setItem(KEY, JSON.stringify(tasks));
    } catch (e) {
      // Storage may be unavailable or full; the app keeps working in memory.
    }
  }

  var api = { KEY: KEY, loadTasks: loadTasks, saveTasks: saveTasks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TaskStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
