const test = require('node:test');
const assert = require('node:assert/strict');
const { TaskStore, validateTasks, MAX_LENGTH } = require('../app/tasks.js');
const { createStorage, STORAGE_KEY } = require('../app/storage.js');

function fakeBackend(initial) {
  const data = new Map(Object.entries(initial || {}));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    data,
  };
}

const valid = (o) => Object.assign({ id: 'a', text: 'x', completed: false, createdAt: 1 }, o);

test('add creates active task at index 0 and trims', () => {
  const s = new TaskStore();
  s.add('first');
  const t = s.add('  second  ');
  assert.equal(t.text, 'second');
  assert.equal(t.completed, false);
  assert.equal(s.all()[0].id, t.id);
  assert.equal(s.all().length, 2);
});

test('add rejects empty, whitespace, over-length, non-string', () => {
  const s = new TaskStore();
  assert.equal(s.add(''), null);
  assert.equal(s.add('   '), null);
  assert.equal(s.add('a'.repeat(MAX_LENGTH + 1)), null);
  assert.equal(s.add(null), null);
  assert.equal(s.all().length, 0);
});

test('add accepts exactly 200 chars', () => {
  const s = new TaskStore();
  assert.ok(s.add('a'.repeat(MAX_LENGTH)));
});

test('toggle on/off and unknown id no-op', () => {
  const s = new TaskStore();
  const t = s.add('x');
  s.toggle(t.id);
  assert.equal(s.all()[0].completed, true);
  s.toggle(t.id);
  assert.equal(s.all()[0].completed, false);
  assert.equal(s.toggle('nope'), null);
  assert.equal(s.all().length, 1);
});

test('remove deletes only target; unknown id no-op; completed can be removed', () => {
  const s = new TaskStore();
  const a = s.add('a');
  const b = s.add('b');
  s.toggle(a.id);
  assert.equal(s.remove('nope'), false);
  assert.equal(s.remove(a.id), true);
  assert.deepEqual(s.all().map((t) => t.id), [b.id]);
});

test('all returns newest first', () => {
  const s = new TaskStore();
  s.add('1'); s.add('2'); s.add('3');
  assert.deepEqual(s.all().map((t) => t.text), ['3', '2', '1']);
});

test('all returns copies', () => {
  const s = new TaskStore();
  s.add('1');
  s.all()[0].text = 'changed';
  assert.equal(s.all()[0].text, '1');
});

test('persistence round-trip', () => {
  const backend = fakeBackend();
  const st = createStorage(backend);
  const s = new TaskStore(st.load());
  s.add('keep'); const b = s.add('toggle');
  s.toggle(b.id);
  assert.equal(st.save(s.all()), true);
  const s2 = new TaskStore(createStorage(backend).load());
  assert.deepEqual(s2.all(), s.all());
  assert.ok(backend.data.has(STORAGE_KEY));
});

test('corrupt JSON loads as empty', () => {
  const st = createStorage(fakeBackend({ [STORAGE_KEY]: '{not json' }));
  assert.deepEqual(st.load(), []);
});

test('non-array value is dropped', () => {
  assert.deepEqual(validateTasks({ a: 1 }), []);
  assert.deepEqual(validateTasks('x'), []);
  assert.deepEqual(validateTasks(null), []);
});

test('invalid items and duplicate ids dropped, valid kept', () => {
  const input = [
    valid({ id: '1' }),
    valid({ id: '2', text: 5 }),
    valid({ id: '3', text: '' }),
    valid({ id: '4', text: 'a'.repeat(201) }),
    valid({ id: '5', completed: 'yes' }),
    valid({ id: '6', createdAt: 'now' }),
    valid({ id: 7 }),
    valid({ id: '1', text: 'dup' }),
    null,
    valid({ id: '8', completed: true }),
  ];
  assert.deepEqual(validateTasks(input).map((t) => t.id), ['1', '8']);
});

test('storage throwing on read or write keeps app working in memory', () => {
  const throwing = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('quota'); },
  };
  const st = createStorage(throwing);
  assert.deepEqual(st.load(), []);
  const s = new TaskStore(st.load());
  s.add('still works');
  assert.equal(st.save(s.all()), false);
  assert.equal(s.all().length, 1);
});

test('ID fallback without crypto.randomUUID is unique, also after reload', () => {
  const s = new TaskStore([], {});
  const ids = [s.add('a').id, s.add('b').id, s.add('c').id];
  assert.equal(new Set(ids).size, 3);
  const s2 = new TaskStore(s.all(), null);
  const more = [s2.add('d').id, s2.add('e').id];
  const all = ids.concat(more);
  assert.equal(new Set(all).size, 5);
});

test('uses crypto.randomUUID when available', () => {
  const s = new TaskStore([], { randomUUID: () => 'fixed-uuid' });
  assert.equal(s.add('a').id, 'fixed-uuid');
});

test('task text with markup is stored verbatim (rendering uses textContent)', () => {
  const s = new TaskStore();
  const t = s.add('<img src=x onerror=alert(1)>');
  assert.equal(t.text, '<img src=x onerror=alert(1)>');
});
