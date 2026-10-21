(function (root, factory) {
  var api = factory(
    typeof module !== 'undefined' && module.exports ? require('./tasks.js') : root.TodoApp
  );
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.TodoApp = root.TodoApp || {};
    root.TodoApp.createStorage = api.createStorage;
    root.TodoApp.STORAGE_KEY = api.STORAGE_KEY;
  }
})(typeof window !== 'undefined' ? window : null, function (tasksApi) {
  var STORAGE_KEY = 'todo.tasks';

  // backend is injected (window.localStorage in the browser); failures fall back to memory.
  function createStorage(backend) {
    var memory = [];

    return {
      load: function () {
        try {
          var raw = backend.getItem(STORAGE_KEY);
          if (raw === null || raw === undefined) return [];
          var tasks = tasksApi.validateTasks(JSON.parse(raw));
          memory = tasks;
          return tasks;
        } catch (e) {
          return memory.slice();
        }
      },
      save: function (tasks) {
        memory = tasks.slice();
        try {
          backend.setItem(STORAGE_KEY, JSON.stringify(tasks));
          return true;
        } catch (e) {
          return false;
        }
      }
    };
  }

  return { createStorage: createStorage, STORAGE_KEY: STORAGE_KEY };
});
