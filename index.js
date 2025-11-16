document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn");
  btn.addEventListener("click", () => {
    window.location.href = "select.html";
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

  async function sendTripData() {
    const tripData = {
      numberOfTravelers: count,
      from: fromValue,
      to: toValue,
      budget: budgetValue,
      fromDate: fromDateValue,
      toDate: toDateValue,
    };

    try {
      const response = await fetch("http://localhost:3000/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      const result = await response.json();

      localStorage.setItem("fromDate", fromDateValue);
      localStorage.setItem("toDate", toDateValue);
      localStorage.setItem("trip", fromValue + "->" + toValue);
      localStorage.setItem("flights", result.data.flights);
      localStorage.setItem("hotel", result.data.hotel);
      localStorage.setItem("weather", result.data.weather);

      window.location.href = "result.html";
      console.log();
    } catch (err) {
      console.error("Error sending trip data:", err);
    }
  }

  sendTripData();
});
