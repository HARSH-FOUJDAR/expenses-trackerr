  document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("expense-name").value;
      const amount = parseFloat(document.getElementById("expense-amount").value);
      const category = document.getElementById("expense-category").value;
      const date = document.getElementById("expense-date").value;

      const expense = {
        id: Date.now(),
        name,
        amount,
        category,
        date
      };

      expenses.push(expense);
      displayExpenses(expenses);
      updateTotalAmount();

      expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
      if (e.target.closest(".delete-btn")) {
        const id = parseInt(e.target.closest(".delete-btn").dataset.id);
        expenses = expenses.filter(expense => expense.id !== id);
        displayExpenses(expenses);
        updateTotalAmount();
      }

      if (e.target.closest(".edit-btn")) {
        const id = parseInt(e.target.closest(".edit-btn").dataset.id);
        const expense = expenses.find(expense => expense.id === id);

        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("expense-date").value = expense.date;

        expenses = expenses.filter(expense => expense.id !== id);
        displayExpenses(expenses);
        updateTotalAmount();
      }
    });

    filterCategory.addEventListener("change", (e) => {
      const category = e.target.value;
      if (category === "All") {
        displayExpenses(expenses);
      } else {
        const filteredExpenses = expenses.filter(expense => expense.category === category);
        displayExpenses(filteredExpenses);
      }
    });

    function displayExpenses(expenses) {
      expenseList.innerHTML = "";
      expenses.forEach(expense => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td class="p-3 border-b text-gray-700">${expense.name}</td>
          <td class="p-3 border-b text-gray-700">$${expense.amount.toFixed(2)}</td>
          <td class="p-3 border-b text-gray-700">${expense.category}</td>
          <td class="p-3 border-b text-gray-700">${expense.date}</td>
          <td class="p-3 border-b flex gap-2 justify-center">
            <button 
              class="edit-btn bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-1"
              data-id="${expense.id}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button 
              class="delete-btn bg-red-500  hover:bg-red-600 text-white cursor-pointer px-3 py-1 rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-1"
              data-id="${expense.id}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        `;

        expenseList.appendChild(row);
      });
    }

    function updateTotalAmount() {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      totalAmount.textContent = total.toFixed(2);
    }
  });