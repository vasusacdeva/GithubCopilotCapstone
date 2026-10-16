const test = require('node:test');
const assert = require('node:assert');
const { addTask, toggleTask, removeTask, MAX_LENGTH } = require('../app/tasks.js');
const { loadTasks, saveTasks, KEY } = require('../app/storage.js');

function fakeStorage(initial) {
  const data = new Map(initial ? [[KEY, initial]] : []);
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, v); },
  };
}

test('addTask appends an active, trimmed task at the bottom', () => {
  let list = addTask([], 'first');
  list = addTask(list, '  second  ');
  assert.strictEqual(list.length, 2);
  assert.strictEqual(list[0].text, 'first');
  assert.strictEqual(list[1].text, 'second');
  assert.strictEqual(list[1].completed, false);
});

test('addTask rejects empty, whitespace-only, non-string and over-length text', () => {
  const base = addTask([], 'keep');
  assert.strictEqual(addTask(base, ''), base);
  assert.strictEqual(addTask(base, '   '), base);
  assert.strictEqual(addTask(base, null), base);
  assert.strictEqual(addTask(base, 'x'.repeat(MAX_LENGTH + 1)), base);
  assert.strictEqual(addTask(base, 'x'.repeat(MAX_LENGTH)).length, 2);
});

test('addTask does not mutate the input list', () => {
  const base = [];
  addTask(base, 'a');
  assert.strictEqual(base.length, 0);
});

test('task ids are unique', () => {
  let list = [];
  for (let i = 0; i < 50; i++) list = addTask(list, 't' + i);
  assert.strictEqual(new Set(list.map((t) => t.id)).size, 50);
});

test('toggleTask marks complete and back', () => {
  const list = addTask([], 'a');
  const done = toggleTask(list, list[0].id);
  assert.strictEqual(done[0].completed, true);
  assert.strictEqual(list[0].completed, false);
  assert.strictEqual(toggleTask(done, list[0].id)[0].completed, false);
});

test('removeTask deletes only the matching task', () => {
  let list = addTask(addTask([], 'a'), 'b');
  const out = removeTask(list, list[0].id);
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].text, 'b');
  assert.strictEqual(list.length, 2);
});

test('script-like text is stored as plain text', () => {
  const payload = '<img src=x onerror=alert(1)>';
  const list = addTask([], payload);
  assert.strictEqual(list[0].text, payload);
});

test('storage round-trips tasks', () => {
  const s = fakeStorage();
  const list = addTask([], 'a');
  saveTasks(s, list);
  assert.deepStrictEqual(loadTasks(s), list);
});

test('loadTasks falls back to [] on missing, corrupt or wrong-shape data', () => {
  assert.deepStrictEqual(loadTasks(fakeStorage()), []);
  assert.deepStrictEqual(loadTasks(fakeStorage('{not json')), []);
  assert.deepStrictEqual(loadTasks(fakeStorage('{"a":1}')), []);
  assert.deepStrictEqual(loadTasks(fakeStorage('[{"id":1}]')), []);
  const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('full'); } };
  assert.deepStrictEqual(loadTasks(throwing), []);
  assert.doesNotThrow(() => saveTasks(throwing, []));
});
