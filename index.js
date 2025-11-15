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
