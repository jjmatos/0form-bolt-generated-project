let dynamicTable = null;

export function generateForm(data, container) {
  const form = document.createElement('form');
  data.forEach(item => {
    for (const key in item) {
      const label = document.createElement('label');
      label.textContent = `${key}:`;
      const input = document.createElement('input');
      input.type = 'text';
      input.name = key;
      input.value = item[key];
      form.appendChild(label);
      form.appendChild(input);
    }
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  form.appendChild(submitButton);
  form.addEventListener('submit', handleSubmit);

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Save to TXT';
  saveButton.addEventListener('click', () => handleSave(form));
  form.appendChild(saveButton);

  container.appendChild(form);
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  addRowToTable(formObject);
}

export function handleSave(form) {
  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  const dataString = Object.entries(formObject)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const blob = new Blob([dataString], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'form-data.txt';
  link.click();

  const resultsContainer = document.getElementById('results');
  resultsContainer.textContent = 'Saved Data:\n' + dataString;
}

export function createDynamicTable() {
  const container = document.getElementById('dynamic-table-container');
  if (dynamicTable) {
    container.removeChild(dynamicTable);
  }

  dynamicTable = document.createElement('table');
  const headerRow = dynamicTable.insertRow();
  const headers = ['Name', 'Email', 'Age', 'Actions'];
  headers.forEach(headerText => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  container.appendChild(dynamicTable);
}

export function addRowToTable(data) {
  if (!dynamicTable) {
    createDynamicTable();
  }

  const row = dynamicTable.insertRow();
  Object.values(data).forEach(text => {
    const cell = row.insertCell();
    cell.textContent = text;
  });

  const actionsCell = row.insertCell();
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'edit-button';
  editButton.addEventListener('click', () => editRow(row));
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', () => deleteRow(row));
  actionsCell.appendChild(deleteButton);
}

function deleteRow(row) {
  dynamicTable.deleteRow(row.rowIndex);
}

function editRow(row) {
  const cells = row.cells;
  const originalData = [];
  for (let i = 0; i < cells.length - 1; i++) {
    originalData.push(cells[i].textContent);
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cells[i].textContent;
    cells[i].textContent = '';
    cells[i].appendChild(input);
  }

  const actionsCell = cells[cells.length - 1];
  actionsCell.innerHTML = '';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.className = 'save-button';
  saveButton.addEventListener('click', () => saveEdit(row, originalData));
  actionsCell.appendChild(saveButton);
}

function saveEdit(row, originalData) {
  const cells = row.cells;
  for (let i = 0; i < cells.length - 1; i++) {
    const input = cells[i].querySelector('input');
    cells[i].textContent = input.value;
  }

  const actionsCell = cells[cells.length - 1];
  actionsCell.innerHTML = '';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'edit-button';
  editButton.addEventListener('click', () => editRow(row));
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', () => deleteRow(row));
  actionsCell.appendChild(deleteButton);
}
