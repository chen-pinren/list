// todo.js
const newTaskInput = document.querySelector('.new-task input');
const addBtn = document.querySelector('.add-btn');
const todoList = document.querySelector('.todo-list');
const doneList = document.querySelector('.done-list');
const template = document.querySelector('.todo-template');

const STORAGE_KEY = 'myday-tasks';

/* ---------- 本地存储 ---------- */
function save() {
  const data = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    data.push({
      text: item.querySelector('.todo-text').innerText,
      done: item.querySelector('.todo-icon').src.includes('circle-done'),
      important: item.querySelector('.star-icon').src.includes('star.png')
    });
  });
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

  icon.onclick = () => toggleDone(icon, txt, node);
  star.onclick = () => toggleStar(star);
  node.querySelector('.del-btn').onclick = () => removeItem(node);
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

/* ---------- 切换完成 ---------- */
function toggleDone(icon, txt, node) {
  const done = icon.src.includes('circle-done');
  if (done) {
    icon.src = 'circle.png';
    txt.style.textDecoration = 'none';
    todoList.insertBefore(node, todoList.firstChild);
  } else {
    icon.src = 'circle-done.png';
    txt.style.textDecoration = 'line-through';
    doneList.appendChild(node);
  }
  save();
}

/* ---------- 切换重要 ---------- */
function toggleStar(star) {
  const filled = star.src.includes('star.png');
  star.src = filled ? 'star-empty.png' : 'star.png';
  save();
}

/* ---------- 删除 ---------- */
function removeItem(node) {
  node.remove();
  save();
}

/* ---------- 初始渲染 ---------- */
function renderAll() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data.forEach(item => createNode(item.text, item.done, item.important));
}
renderAll();