// Seleccionar elementos del DOM
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// Variables para editar elementos
let editElement;
let editFlag = false;
let editID = "";

// Event listeners
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// Función para agregar un nuevo item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  // Si hay un valor y no estamos en modo edición
  if (value !== "" && !editFlag) {
    // Crear un nuevo elemento <article> con el valor del input
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // Añadir event listeners a los botones de editar y eliminar
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // Añadir el elemento al DOM
    list.appendChild(element);
    // Mostrar alerta
    displayAlert("item added to the list", "success");
    // Mostrar el contenedor
    container.classList.add("show-container");
    // Guardar en el almacenamiento local
    addToLocalStorage(id, value);
    // Resetear el formulario
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // Si estamos editando, cambiar el valor del elemento
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // Actualizar el almacenamiento local
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    // Si no hay valor, mostrar alerta de error
    displayAlert("please enter value", "danger");
  }
}

// Función para mostrar una alerta
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // Eliminar la alerta después de 1 segundo
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Función para limpiar todos los items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// Función para eliminar un item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // Eliminar del almacenamiento local
  removeFromLocalStorage(id);
}

// Función para editar un item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // Guardar el elemento a editar
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // Establecer el valor del formulario como el valor actual del elemento
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  // Cambiar el texto del botón de submit
  submitBtn.textContent = "edit";
}

// Función para resetear los valores por defecto
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// Función para añadir un item al almacenamiento local
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

// Función para obtener los items del almacenamiento local
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Función para eliminar un item del almacenamiento local
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// Función para editar un item en el almacenamiento local
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Función para inicializar los items desde el almacenamiento local al cargar la página
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

// Función para crear un nuevo item en el DOM: interfaz de programación que permite a los programas acceder y manipular la estructura
function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // Añadir event listeners a los botones de editar y eliminar
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // Añadir el elemento al DOM
  list.appendChild(element);
}