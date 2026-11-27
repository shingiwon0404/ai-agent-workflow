const { addTask, removeTask, readTasks, toggleTask } = require('../../public/tasks.js');

test('adds a trimmed task without mutating the old list', () => {
  const original = [];
  expect(addTask(original, '  문서 작성  ', 'a')).toEqual([{ id: 'a', title: '문서 작성', completed: false }]);
  expect(original).toEqual([]);
});

test('rejects empty and overlong titles', () => {
  expect(() => addTask([], '  ', 'a')).toThrow();
  expect(() => addTask([], 'x'.repeat(101), 'a')).toThrow();
});

test('removes only the selected task', () => {
  const tasks = [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }];
  expect(removeTask(tasks, 'a')).toEqual([{ id: 'b', title: 'B' }]);
});

test('recovers from invalid stored data', () => {
  expect(readTasks('{oops')).toEqual([]);
  expect(readTasks('{}')).toEqual([]);
  expect(readTasks('[{"id":"a","title":"A"},null,{"title":"bad"}]')).toEqual([{ id: 'a', title: 'A', completed: false }]);
});

test('toggles only the selected task and preserves both states in storage', () => {
  const original = [
    { id: 'a', title: 'A', completed: false },
    { id: 'b', title: 'B', completed: false },
  ];
  const completed = toggleTask(original, 'a');

  expect(original[0].completed).toBe(false);
  expect(completed).toEqual([{ ...original[0], completed: true }, original[1]]);
  expect(readTasks(JSON.stringify(completed))).toEqual(completed);
  expect(toggleTask(completed, 'a')).toEqual(original);
  expect(removeTask(completed, 'a')).toEqual([original[1]]);
});
