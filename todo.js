// 获取元素
const newTaskInput = document.querySelector('.new-task input');
const addBtn = document.querySelector('.add-btn');
const todoList = document.querySelector('.todo-list');
const doneList = document.querySelector('.done-list');
const template = document.querySelector('.todo-template');
const STORAGE_KEY = 'myday-tasks';

/* ---------- 事件委托（动态元素交互） ---------- */
document.addEventListener('click', e => {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  if (e.target.classList.contains('todo-icon')) {
    toggleDone(item);
  } else if (e.target.classList.contains('star-icon')) {
    toggleStar(item);
  } else if (e.target.classList.contains('del-btn')) {
    removeItem(item);
  }
});

/* ---------- 本地存储 ---------- */
function save() {
  const data = [...document.querySelectorAll('.todo-item')].map(item => ({
    text: item.querySelector('.todo-text').innerText,
    done: item.querySelector('.todo-icon').src.includes('circle-done'),
    important: item.querySelector('.star-icon').src.includes('star.png')
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ---------- 创建节点 ---------- */
function createNode(text, done = false, important = false) {
  const clone = template.cloneNode(true);
  const node = clone.querySelector('.todo-item');

  node.querySelector('.todo-text').innerText = text;
  const icon = node.querySelector('.todo-icon');
  const star = node.querySelector('.star-icon');
  const txt = node.querySelector('.todo-text');

  if (done) {
    icon.src = 'circle-done.png';
    txt.style.textDecoration = 'line-through';
    doneList.appendChild(node);
  } else {
    todoList.appendChild(node);
  }
  if (important) star.src = 'star.png';
}

/* ---------- 切换完成 ---------- */
function toggleDone(item) {
  const icon = item.querySelector('.todo-icon');
  const txt = item.querySelector('.todo-text');
  const done = icon.src.includes('circle-done');

  if (done) {
    icon.src = 'circle.png';
    txt.style.textDecoration = 'none';
    todoList.insertBefore(item, todoList.firstChild);
  } else {
    icon.src = 'circle-done.png';
    txt.style.textDecoration = 'line-through';
    doneList.appendChild(item);
  }
  save();
}

/* ---------- 切换重要 ---------- */
function toggleStar(item) {
  const star = item.querySelector('.star-icon');
  star.src = star.src.includes('star.png') ? 'star-empty.png' : 'star.png';
  save();
}

/* ---------- 删除 ---------- */
function removeItem(item) {
  item.remove();
  save();
}

/* ---------- 添加任务 ---------- */
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;
  createNode(text);
  save();
  newTaskInput.value = '';
}
addBtn.onclick = addTask;

/* ---------- 初始渲染（读取 localStorage） ---------- */
(function renderAll() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data.forEach(item => createNode(item.text, item.done, item.important));
})();
