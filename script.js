// Select DOM elements
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const countSpan = document.getElementById("count");
const filterSpans = document.querySelectorAll(".filters span");

// Initialize state
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// --- Functions ---

// 1. Save to LocalStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateCount();
}

// 2. Render the list based on filter
function renderTodos() {
    todoList.innerHTML = "";
    
    // Filter logic
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true; // 'all'
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

// 3. Add a new task
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

// 4. Delete a task
function deleteTask(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 5. Toggle completed status
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

// 6. Update pending task count
function updateCount() {
    const pendingCount = todos.filter(todo => !todo.completed).length;
    countSpan.textContent = pendingCount;
}

// 7. Clear all tasks
function clearAll() {
    if(confirm("Are you sure you want to clear all tasks?")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// 8. Filter Tasks (Tabs)
function filterTasks(filterType) {
    currentFilter = filterType;
    
    // Update visual tab state
    filterSpans.forEach(span => span.classList.remove("active"));
    event.target.classList.add("active");
    
    // In strict mode mapping:
    // 'Pending' in HTML maps to 'active' logic here if you want accurate variable names
    // But for simplicity, we keep the HTML onclick names aligned:
    if(filterType === 'pending') currentFilter = 'active'; 
    else currentFilter = filterType;

    renderTodos();
}

// --- Event Listeners ---

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
});

// Initial Render
renderTodos();