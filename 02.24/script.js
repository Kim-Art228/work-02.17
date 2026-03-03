const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const storageStatus = document.querySelector('#storageStatus');
const themeToggleBtn = document.querySelector('#themeToggle');
const totalCountEl = document.querySelector('#totalCount');
const doneCountEl = document.querySelector('#doneCount');
const lastVisitEl = document.querySelector('#lastVisit');


function Theme(){
    const stored = localStorage.getItem('theme');
    if(stored === 'dark'){
        document.documentElement.classList.add('dark');
        if(themeToggleBtn) themeToggleBtn.textContent = 'Светлая тема';
    } else {
        if(themeToggleBtn) themeToggleBtn.textContent = 'Тёмная тема';
    }
}

function toggleTheme(){
    const darkNow = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', darkNow ? 'dark' : 'light');
    themeToggleBtn.textContent = darkNow ? 'Светлая тема' : 'Тёмная тема';
}

if(themeToggleBtn){
    themeToggleBtn.addEventListener('click', toggleTheme);
}

Theme();

showLastVisit();

let tasks = JSON.parse(localStorage.getItem('todo_list')) || [];
updateUI();

function addTask(){
    const text = taskInput.value.trim();
    if(text == "") return

    const newTask = {
        id: Date.now(),
        text: text
    };

    tasks.push(newTask);
    saveAndRefresh();
    taskInput.value = "";
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !=id);
    saveAndRefresh()
}

function saveAndRefresh(){
    localStorage.setItem('todo_list', JSON.stringify(tasks));
    updateUI();
}

function updateUI(){
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="button-group">
                <button class="done-btn">done</button>
                <button class="delete-btn">delete</button>
            </div>
        `;

        li.querySelector('.delete-btn')
          .addEventListener('click', () => deleteTask(task.id));
        li.querySelector('.done-btn')
          .addEventListener('click', () => toggleDone(task.id));

        taskList.appendChild(li);
    });

    storageStatus.textContent = tasks.length > 0
        ? `there are ${tasks.length} tasks`
        : "null";
    updateStats();
}

function clearStorage(){
    if (confirm("are you sure about deleting all tasks")){
        localStorage.clear();
        tasks = [];
        updateUI();
    }
}

function updateStats(){
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    if(totalCountEl) totalCountEl.textContent = total;
    if(doneCountEl) doneCountEl.textContent = done;
}

function showLastVisit(){
    const prev = localStorage.getItem('lastVisit');
    if(prev){
        console.log('Previous visit:', prev);
        if(lastVisitEl) lastVisitEl.textContent = prev;
    } else {
        if(lastVisitEl) lastVisitEl.textContent = '(впервые)';
    }
    const now = new Date().toLocaleString();
    localStorage.setItem('lastVisit', now);
}


addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        addTask();
    }
})

function toggleDone(id){
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveAndRefresh();
}