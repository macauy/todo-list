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

// Variables globales
let tasks = []
let hayCompletadas = false

// Elementos del DOM
const form = document.getElementById('form')
const back = document.getElementById('back')
const list = document.getElementById('tasks')
const taskList = document.getElementById('task-list')
const deleteOption = document.getElementById('delete-completed')




// LOAD inicial
window.addEventListener("load", function() {
    tasks = JSON.parse(localStorage.getItem('TASKS'));
    if (tasks==null){
        tasks = []
    }
    loadTasks()
});

// Funciones
function loadTasks() {
    taskList.innerHTML = ''
    
    if (tasks.length>0) {
        showTasks()
        tasks.forEach( (item,index) => {
            renderTask(item,index) 
        })

        // Actualizar completados
        updateCompleted()

    } else {
        loadEmptyTaks()
    }
    // actualizar LocalStorage
    setLocalStorage()
}

function renderTask(task,index) {
    let prioClass = '';
    let checkClass = ''
    let check = '<i class="fa-regular fa-square"></i>'

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
        checkClass = 'checked'
        check = '<i class="fa-solid fa-check"></i>'
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

    let item = 
    `<div class="task-item ${prioClass}">
        <i class="fa-solid ${catClass}" title="${catTitle}"></i>
        <label>
            <h3>${task.titulo}</h3>
            <small>${task.descripcion}</small>
        </label>
        <div class="borrar">
            <input type="checkbox" id="${index}" ${checkClass}>
            <label for="${index}" onclick="markTaskResolved(event,${index})">${check}</label>
        </div>
        <div class="borrar" onclick="deleteTask(event,${index})"><i class="fa-regular fa-trash-can" title="Eliminar"></i></div>
    </div>`;
    taskList.innerHTML += item;
}


// Eventos asociados al DOM

// Abrir FORM
function popupNewTask() {
    form.classList.remove('hidden')
    if (!back.classList.contains('hidden'))
        back.classList.add('hidden') 
    if (!list.classList.contains('hidden'))
        list.classList.add('hidden')     
}

// Cerrar FORM
function closeNewTask() {
    form.classList.add('hidden')
    loadTasks()
}

// Marcar Resuelta
function markTaskResolved(event,index) {
    event.target.parentNode.parentNode.parentNode.classList.toggle('completed')
    
    // marcar completada la tarea en la coleccion
    tasks[index].completada = (!tasks[index].completada)

    tasks[index].completada ? event.target.parentNode.innerHTML = '<i class="fa-solid fa-check"></i>' : event.target.parentNode.innerHTML = '<i class="fa-regular fa-square"></i>'

    // actualizar completadas
    updateCompleted()
    
    // actualizar LocalStorage
    setLocalStorage()
}

// Eliminar tarea
function deleteTask(event,index) {
    event.stopPropagation()
    
    // sacar de la coleccion de tareas
    tasks.splice(index,1)

    // regargo tareas
    loadTasks()
}

// Eliminar completadas
function deleteCompleted() {
    tasks = tasks.filter(item => item.completada==false)
    loadTasks()
}


// LOGICA
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

function updateCompleted() {
    hayCompletadas = tasks.some((item) => item.completada==true)
    if (hayCompletadas) {
        deleteOption.style.display = 'block'
    } else {
        deleteOption.style.display = 'none'
    }
}


// Auxiliares para manipular DOM
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



// LOCAL STORAGE
function setLocalStorage(){
    localStorage.setItem('TASKS', JSON.stringify(tasks));
}

