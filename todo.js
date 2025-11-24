// 获取元素
const newTaskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');
const STORAGE_KEY = 'myday-tasks';

// 添加任务功能
function addTask() {
    const text = newTaskInput.value.trim();
    if (text === '') return;
    
    const newItem = createTodoItem(text);
    todoList.appendChild(newItem);
    newTaskInput.value = '';
    updateEmptyState();
    save();
}

// 创建任务项
function createTodoItem(text, done = false, important = false) {
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
        <img class="todo-icon" src="${done ? 'circle-done.png' : 'circle.png'}" alt="状态">
        <div class="todo-content">
            <div class="todo-text">${text}</div>
            <div class="todo-type">任务</div>
        </div>
        <img class="star-icon" src="${important ? 'star.png' : 'star-empty.png'}" alt="重要">
        <button class="del-btn">删除</button>
    `;
    return item;
}

// 切换完成状态
function toggleDone(item) {
    const icon = item.querySelector('.todo-icon');
    const isDone = icon.src.includes('circle-done');
    
    if (isDone) {
        icon.src = 'circle.png';
        todoList.appendChild(item);
    } else {
        icon.src = 'circle-done.png';
        doneList.appendChild(item);
    }
    
    updateEmptyState();
    save();
}

// 切换重要状态
function toggleStar(item) {
    const star = item.querySelector('.star-icon');
    const isImportant = star.src.includes('star.png');
    star.src = isImportant ? 'star-empty.png' : 'star.png';
    save();
}

// 删除任务
function removeItem(item) {
    item.remove();
    updateEmptyState();
    save();
}

// 更新空状态显示
function updateEmptyState() {
    const todoItems = todoList.querySelectorAll('.todo-item');
    const doneItems = doneList.querySelectorAll('.todo-item');
    
    // 处理待办列表
    let todoEmpty = todoList.querySelector('.empty-state');
    if (todoItems.length === 0 && !todoEmpty) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-state';
        emptyMsg.textContent = '暂无待办任务';
        todoList.appendChild(emptyMsg);
    } else if (todoItems.length > 0 && todoEmpty) {
        todoEmpty.remove();
    }
    
    // 处理已完成列表
    let doneEmpty = doneList.querySelector('.empty-state');
    if (doneItems.length === 0 && !doneEmpty) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-state';
        emptyMsg.textContent = '暂无已完成任务';
        doneList.appendChild(emptyMsg);
    } else if (doneItems.length > 0 && doneEmpty) {
        doneEmpty.remove();
    }
}

// 本地存储
function save() {
    const todoItems = [...todoList.querySelectorAll('.todo-item')];
    const doneItems = [...doneList.querySelectorAll('.todo-item')];
    const allItems = [...todoItems, ...doneItems];
    
    const data = allItems.map(item => ({
        text: item.querySelector('.todo-text').textContent,
        done: item.querySelector('.todo-icon').src.includes('circle-done'),
        important: item.querySelector('.star-icon').src.includes('star.png')
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    try {
        const items = JSON.parse(saved);
        
        items.forEach(itemData => {
            if (itemData.text && itemData.text.trim() !== '') {
                const newItem = createTodoItem(itemData.text, itemData.done, itemData.important);
                if (itemData.done) {
                    doneList.appendChild(newItem);
                } else {
                    todoList.appendChild(newItem);
                }
            }
        });
        
        updateEmptyState();
    } catch (e) {
        console.error('加载数据失败:', e);
    }
}

// 事件绑定
addBtn.addEventListener('click', addTask);

newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 事件委托
document.addEventListener('click', function(e) {
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

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    load();
});
