// LocalStorage key
const STORAGE_KEY = "transactions_v1";
let transactions = [];

// DOM Elements
const form = document.getElementById("transaction-form");
const typeEl = document.getElementById("transaction-type");
const nameEl = document.getElementById("transaction-name");
const amountEl = document.getElementById("transaction-amount");
const categoryEl = document.getElementById("transaction-category");
const dateEl = document.getElementById("transaction-date");
const filterEl = document.getElementById("filter-category");
const listEl = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

// Load from localStorage
function load() {
  const data = localStorage.getItem(STORAGE_KEY);
  transactions = data ? JSON.parse(data) : [];
}

// Save to localStorage
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Generate ID
function genId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Add transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const txn = {
    id: genId(),
    type: typeEl.value,
    name: nameEl.value.trim(),
    amount: parseFloat(amountEl.value),
    category: categoryEl.value,
    date: dateEl.value,
  };

  if (!txn.name || !txn.amount || txn.amount <= 0) {
    alert("Please enter valid details!");
    return;
  }

  transactions.push(txn);
  save();
  render();

  form.reset();
});

// Delete transaction
function deleteTxn(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save();
  render();
}

// Edit transaction
function editTxn(id) {
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;

  const newName = prompt("Edit Name:", txn.name);
  const newAmount = prompt("Edit Amount:", txn.amount);
  if (newName && newAmount && !isNaN(newAmount)) {
    txn.name = newName;
    txn.amount = parseFloat(newAmount);
    save();
    render();
  }
}

// Render function
function render() {
  listEl.innerHTML = "";

  const filter = filterEl.value;
  let filtered = transactions;
  if (filter !== "All") {
    filtered = transactions.filter((t) => t.category === filter);
  }

  filtered.forEach((txn) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border-b text-${txn.type === "income" ? "green" : "red"}-600 font-bold">${txn.type}</td>
      <td class="p-3 border-b">${txn.name}</td>
      <td class="p-3 border-b">$${txn.amount.toFixed(2)}</td>
      <td class="p-3 border-b">${txn.category}</td>
      <td class="p-3 border-b">${txn.date}</td>
      <td class="p-3 border-b">
        <button onclick="editTxn(${txn.id})" class="text-blue-600 hover:underline mr-2">Edit</button>
        <button onclick="deleteTxn(${txn.id})" class="text-red-600 hover:underline">Delete</button>
      </td>
    `;
    listEl.appendChild(row);
  });

  // Totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  incomeEl.textContent = income.toFixed(2);
  expenseEl.textContent = expense.toFixed(2);
  balanceEl.textContent = (income - expense).toFixed(2);
}

// Filter change
filterEl.addEventListener("change", render);

// Init
load();
render();

// expose globally
window.deleteTxn = deleteTxn;
window.editTxn = editTxn;
