

// Retrieve tasks and nextId from localStorage.
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (taskList && taskList.length) {
        nextId = taskList.length + 1;
        localStorage.setItem("nextId", nextId);
    } else {
        localStorage.setItem("tasks", JSON.stringify([]));
        localStorage.setItem("nextId", 1);
        nextId = 1;
        taskList = [];
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    generateTaskId();
    const $titleInput = $('#formControlTitle');
    const $dueDateInput = $('#formControlDueDate');
    const $textAreaInput = $('#formControlTextarea1');
    const $modal = $('#formModal');
    const title = $titleInput.val();
    const dueDate = $dueDateInput.val();
    const description = $textAreaInput.val();
    const task = { id: nextId, title, dueDate, description };
    console.log({task}); 
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $titleInput.val('');
    $dueDateInput.val('');
    $textAreaInput.val('');
    $modal.modal('hide');
    location.reload(true);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const $todoCardsContainerEl = $('#todo-cards');
    console.log(task.dueDate)
    const $cardEl = $('<div class="card task-card">');
    const $nextIdEl = $('<input type="hidden" class="nextId" name="nextId">');
    console.log({task});
    $nextIdEl.val(task.id);
    const $cardBodyEl = $('<div class="card-body">');
    const $cardTitleEl = $('<h5 class="card-title"></h5>');
    $cardTitleEl.text(task.title);
    const $cardDescriptionEl = $('<p class="card-text"></p>');
    $cardDescriptionEl.text(task.description);
    const $cardDueDateEl = $('<p class="due-date"></p>');

    $cardDueDateEl.text(task.dueDate);
    const $removeButtonEl = $('<button class="btn btn-danger btn-small removeButton delete-item-btn">Remove</button>');
    $cardBodyEl.append($cardTitleEl, $cardDescriptionEl, $cardDueDateEl, $nextIdEl, $removeButtonEl);
    $cardEl.append($cardBodyEl);
    $todoCardsContainerEl.append($cardEl);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    for (const task of taskList){
        createTaskCard(task);
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const $removeButtonEl = $(event.target);
    console.log({event});
    $removeButtonEl.parent().parent('.card').remove();
    const $taskIdEl = $removeButtonEl.siblings('input.nextId');
    const taskList = JSON.parse(localStorage.getItem("tasks"));
    const filteredTaskList = taskList.filter(task => task.id !== parseInt($taskIdEl.val()));
    localStorage.setItem("tasks", JSON.stringify(filteredTaskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    $( this )
    .addClass( "ui-state-highlight" )
    .find( "p" )
    .html( "Dropped!" );
    
}



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $( "#formControlDueDate" ).datepicker();
    const $addTaskButton = $('#addTaskButton');
    $addTaskButton.on("click", handleAddTask);
    renderTaskList();
    $( ".task-card" ).draggable({
        snap: ".snap-lane",
        snapMode: "inner",
        snapTolerance: 30,
        stack: ".task-card",
        zIndex: 100
    });
    $( "#in-progress", "#to-do", "#done" ).droppable({
        accept: ".task-card",
        drop: handleDrop,
      });
      
    const $removeButtonsEl = $('.removeButton');
    $removeButtonsEl.on("click", handleDeleteTask);
});
