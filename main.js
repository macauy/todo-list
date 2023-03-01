/* 
Objeto Task
let task = {
    titulo,
    categoria,
    descripcion,
    prioridad,
    completada
}
*/

// LOAD inicial
window.addEventListener("load", function() {
    tasks = JSON.parse(localStorage.getItem('TASKS'));
    if (tasks==null){
        tasks = []

    }
    loadTasks()
});

// Elementos del DOM
const add = document.getElementById('add')
const form = document.getElementById('form')
const back = document.getElementById('back')
const list = document.getElementById('tasks')
const taskList = document.getElementById('task-list')

// Funciones
function loadTasks() {
    taskList.innerHTML = ''
    
    if (tasks.length>0) {
        showTasks()
        tasks.forEach( (item,index) => {
            renderTask(item,index) 
        })
    } else {
        loadEmptyTaks()
    }
    // actualizar LocalStorage
    setLocalStorage()
}

function renderTask(task,index) {
    let prioClass = '';
    switch (task.prioridad) {
        case 0: prioClass=''
        break;
        case 1: prioClass='low-priority'
        break;
        case 2: prioClass='medium-priority'
        break;
        case 3: prioClass='high-priority'
        break;
    }
    
    if (task.completada) {
        prioClass += ' completed'
    }

    let catClass = '';
    switch (task.categoria) {
        case 'work':
            catClass = 'fa-briefcase'
            catTitle = 'Trabajo'
            break;
        case 'personal':
            catClass = 'fa-laptop'
            catTitle = 'Personal'
            break;
        case 'home':
            catClass = 'fa-house'
            catTitle = 'Doméstica'
            break;
        case 'fun':
            catClass = 'fa-person-snowboarding'
            catTitle = 'Entretenimiento'
            break;
    }

    let item = `<div class="task-item ${prioClass}" onclick="markTaskResolved(this,${index})">
    <i class="fa-solid ${catClass}" title="${catTitle}"></i>
    <label title="Marcar completada">
        <h3>${task.titulo}</h3>
        <small>${task.descripcion}</small>
    </label>
    <div class="borrar" onclick="deleteTask(event,${index})"><i class="fa-regular fa-trash-can" title="Eliminar"></i></div>
    </div>`;

    taskList.innerHTML += item;
}

function popupNewTask() {
    form.classList.remove('hidden')

    if (!back.classList.contains('hidden'))
        back.classList.add('hidden') 
    if (!list.classList.contains('hidden'))
        list.classList.add('hidden')     
}

function closeNewTask() {
    form.classList.add('hidden')
    loadTasks()
}

function showTasks() {
    if (list.classList.contains('hidden'))
    list.classList.remove('hidden') 

    if (!back.classList.contains('hidden'))
        back.classList.add('hidden') 
}

function loadEmptyTaks() {
    list.classList.add('hidden')
    if (back.classList.contains('hidden'))
        back.classList.remove('hidden') 
}


function addNewTask() {

    const title = document.getElementById('form-title')
    const desc = document.getElementById('form-desc')
    const cat = document.getElementById('form-cat')
    let prio = document.querySelector('input[type=radio]:checked')

    let newTask = {};

    if (title.value != '') {
        newTask.titulo = title.value
        newTask.categoria = cat.value
        newTask.descripcion = desc.value
        newTask.prioridad = parseInt(prio.value)
        newTask.completada = false

        // Reiniciar valores por defecto
        title.value = ''
        desc.value = ''
        cat.value = 'work'
        prio.checked = false
        let prio1 = document.getElementById('color-1')
        prio1.checked = true


        // renderizo tarea creada
        //renderTask(newTask,tasks.length)

        // agrego tarea a coleccion
        tasks.push(newTask)

        // cierro form
        closeNewTask()

        // actualizar LocalStorage
        setLocalStorage()

    } else {
        title.focus()
    }    
}

function markTaskResolved(item,index) {

    item.classList.toggle('completed')

    // marcar completada la tarea en la coleccion
    tasks[index].completada = (!tasks[index].completada)

    // actualizar LocalStorage
    setLocalStorage()
}

function deleteTask(event,index) {
    event.stopPropagation()
    
    // sacar de la coleccion de tareas
    tasks.splice(index,1)

    // regargo tareas
    loadTasks()
}

function deleteCompleted() {
    tasks = tasks.filter(item => item.completada==false)

    loadTasks()
}

function setLocalStorage(){
    // actualizar LocalStorage
    localStorage.setItem('TASKS', JSON.stringify(tasks));
}

