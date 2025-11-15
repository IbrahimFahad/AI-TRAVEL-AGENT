document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn");
  btn.addEventListener("click", () => {
    window.location.href = "select.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-2");
  btn.addEventListener("click", () => {
    window.location.href = "result.html";
  });
});

let count = 1;

const value = document.getElementById("value");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");

plus.addEventListener("click", () => {
  count++;
  value.textContent = count;
});

minus.addEventListener("click", () => {
  if (count > 0) {
    count--;
    value.textContent = count;
  }
});

const numberoftravelers = count;

const flyingFrom = document.querySelector('textarea[name="flying-from"]');
const flyingTo = document.querySelector('textarea[name="Flying-to"]');
const budget = document.querySelector('textarea[name="Budget"]');

const fromDate = document.querySelector('input[name="from-date"]');
const toDate = document.querySelector('input[name="To Date"]');

const planButton = document.querySelector(".btn-2");

planButton.addEventListener("click", () => {
  const fromValue = flyingFrom.value;
  const toValue = flyingTo.value;
  const budgetValue = budget.value;
  const fromDateValue = fromDate.value;
  const toDateValue = toDate.value;
});
