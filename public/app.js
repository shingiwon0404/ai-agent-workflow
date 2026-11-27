const storageKey = 'small-steps.tasks.v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-title');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const empty = document.querySelector('#empty-state');
const message = document.querySelector('#message');
let tasks;

try {
  tasks = TaskLogic.readTasks(localStorage.getItem(storageKey));
} catch {
  tasks = [];
  message.textContent = '브라우저 저장 공간을 사용할 수 없어 새로고침하면 목록이 사라질 수 있어요.';
}

function saveAndRender() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch {
    message.textContent = '목록을 저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요.';
  }
  render();
}

function render() {
  list.replaceChildren();
  for (const task of tasks) {
    const item = document.createElement('li');
    item.className = 'task';
    const dot = document.createElement('span');
    dot.className = 'task-dot';
    dot.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    const remove = document.createElement('button');
    remove.className = 'delete-button';
    remove.type = 'button';
    remove.textContent = '삭제';
    remove.setAttribute('aria-label', `${task.title} 삭제`);
    remove.addEventListener('click', () => {
      tasks = TaskLogic.removeTask(tasks, task.id);
      message.textContent = '';
      saveAndRender();
    });
    item.append(dot, title, remove);
    list.append(item);
  }
  count.textContent = `${tasks.length}개`;
  empty.hidden = tasks.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    tasks = TaskLogic.addTask(tasks, input.value, crypto.randomUUID());
    input.value = '';
    message.textContent = '';
    saveAndRender();
    input.focus();
  } catch (error) {
    message.textContent = error.message;
  }
});

render();
