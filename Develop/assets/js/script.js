// Retrieves tasks and nextId from localStorage.
let nextId = JSON.parse(localStorage.getItem("nextId"));
function getTaskList() {
    const taskList = JSON.parse(localStorage.getItem("tasks"));
    return taskList || [];
}
function setTaskList(taskList) {
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Function to generate a unique task id
function generateTaskId() {
    const taskList = getTaskList();
    if (taskList && taskList.length) {
        nextId = taskList.length + 1;
        localStorage.setItem("nextId", nextId);
    } else {
        setTaskList([]);
        localStorage.setItem("nextId", 1);
        nextId = 1;
    }
}

// Function to handle adding a new task
function handleAddTask(event) {
    generateTaskId();
    const $titleInput = $('#formControlTitle');
    const $dueDateInput = $('#formControlDueDate');
    const $textAreaInput = $('#formControlTextarea1');
    const $modal = $('#formModal');
    const title = $titleInput.val();
    const dueDate = $dueDateInput.val();
    const description = $textAreaInput.val();
    const task = { id: nextId, title, dueDate, description, status: 'to-do' };
    const taskList = getTaskList();
    taskList.push(task);
    setTaskList(taskList);
    $titleInput.val('');
    $dueDateInput.val('');
    $textAreaInput.val('');
    $modal.modal('hide');
    renderTaskList();
}

// Function to create a task card
function createTaskCard(task) {
    const $cardEl = $('<div class="card task-card">');
    $cardEl.attr('data-task-id', task.id);
    const $nextIdEl = $('<input type="hidden" class="nextId" name="nextId">');
    $nextIdEl.val(task.id);
    const $cardBodyEl = $('<div class="card-body">');
    const $cardTitleEl = $('<h5 class="card-title"></h5>');
    $cardTitleEl.text(task.title);
    const $cardDescriptionEl = $('<p class="card-text"></p>');
    $cardDescriptionEl.text(task.description);
    const $cardDueDateEl = $('<p class="due-date"></p>');
    $cardDueDateEl.text(task.dueDate);
    const $removeButtonEl = $('<button class="btn btn-danger btn-small removeButton delete-item-btn">Remove</button>');
    $removeButtonEl.on("click", handleDeleteTask);
    $cardBodyEl.append($cardTitleEl, $cardDescriptionEl, $cardDueDateEl, $nextIdEl, $removeButtonEl);
    $cardEl.append($cardBodyEl);
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        if (now.isSame(taskDueDate, 'day')) {
            $cardEl.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            $cardEl.addClass('bg-danger text-white');
            $removeButtonEl.addClass('border-light');
        }
    }
    return $cardEl;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    const taskList = getTaskList();
    const todoList = $('#todo-cards');
    todoList.empty();
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
    const doneList = $('#done-cards');
    doneList.empty();
    for (const task of taskList) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
    $(".task-card").draggable({
        snap: ".snap-lane",
        snapMode: "inner",
        snapTolerance: 30,
        stack: ".task-card",
        zIndex: 100
    });
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const $removeButtonEl = $(event.target);
    $removeButtonEl.parent().parent('.card').remove();
    const $taskIdEl = $removeButtonEl.siblings('input.nextId');
    const taskList = getTaskList();
    const filteredTaskList = taskList.filter(task => task.id !== parseInt($taskIdEl.val()));
    setTaskList(filteredTaskList);
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = getTaskList();
    const taskId = parseInt(ui.draggable[0].dataset.taskId);
    const newStatus = event.target.id;
    for (let task of tasks) {

        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    setTaskList(tasks);
    renderTaskList();
}

// When page loads, renders the task list, adds event listeners, makes lanes droppable, and makes the due date field a date picker
$(document).ready(function () {
    $("#formControlDueDate").datepicker();
    const $addTaskButton = $('#addTaskButton');
    $addTaskButton.on("click", handleAddTask);
    renderTaskList();
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop,
    });
});
