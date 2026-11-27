(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TaskLogic = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  function readTasks(value) {
    try {
      const parsed = JSON.parse(value || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((task) => task && typeof task.id === 'string' && typeof task.title === 'string')
        .map((task) => ({ ...task, completed: task.completed === true }));
    } catch {
      return [];
    }
  }

  function addTask(tasks, title, id) {
    const cleaned = title.trim();
    if (!cleaned || cleaned.length > 100) throw new Error('할 일은 1자 이상 100자 이하로 입력해 주세요.');
    return [...tasks, { id, title: cleaned, completed: false }];
  }

  function toggleTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  }

  function removeTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
  }

  return { readTasks, addTask, toggleTask, removeTask };
});
