import { v4 as uuidV4 } from "uuid"
import "./styles.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as bootstrap from 'bootstrap';

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const errorModalElement = document.getElementById("errorModal") as HTMLElement;
const errorModal = new bootstrap.Modal(errorModalElement);

const input = document.querySelector<HTMLInputElement>("#new-task-title")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  if (isDuplicate(input?.value)) {
    errorModal.show();
    return;
  }

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  }
  addListItem(newTask)
  input.value = ""
  
  tasks.push(newTask)
  saveTasks()
})

function isDuplicate(title: string): boolean {
  return tasks.some(task => task.title.toLowerCase() === title.toLowerCase())
}

function addListItem(task: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  const deleteButton = document.createElement("button")

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks()
  })

  checkbox.type = "checkbox"
  checkbox.checked = task.completed

  deleteButton.textContent = "x"
  deleteButton.classList.add("delete-button")
  deleteButton.addEventListener("click", () => {
    item.remove()

    const taskIndex = tasks.findIndex(t => t.id === task.id)
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1)
      saveTasks()
    }
  })

  label.append(checkbox, task.title)
  item.append(label, deleteButton)
  list?.append(item)

  if (list) {
    list.insertBefore(item, list.firstChild);
  }
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}
