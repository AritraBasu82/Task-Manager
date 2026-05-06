
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const countSpan = document.getElementById("count");
const filterSpans = document.querySelectorAll(".filters span");


let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";


function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateCount();
}

function renderTodos() {
    todoList.innerHTML = "";
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li style="text-align:center; color:#ccc;">No tasks found</li>';
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? 'checked' : ''}`;
        
        li.innerHTML = `
            <button class="check-btn" onclick="toggleComplete(${todo.id})">
                <i class="fas ${todo.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <span class="todo-text" onclick="toggleComplete(${todo.id})">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTask(${todo.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        todoList.appendChild(li);
    });
    
    updateCount();
}


function addTask() {
    const text = input.value.trim();
    if (text === "") return alert("Please write a task!");

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTask);
    saveTodos();
    renderTodos();
    input.value = "";
}


function deleteTask(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function updateCount() {
    const pendingCount = todos.filter(todo => !todo.completed).length;
    countSpan.textContent = pendingCount;
}

function clearAll() {
    if(confirm("Are you sure you want to clear all tasks?")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

function filterTasks(filterType) {
    currentFilter = filterType;
    

    filterSpans.forEach(span => span.classList.remove("active"));
    event.target.classList.add("active");

    if(filterType === 'pending') currentFilter = 'active'; 
    else currentFilter = filterType;

    renderTodos();
}



addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
});

renderTodos();
