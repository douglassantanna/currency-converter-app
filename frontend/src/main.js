let apiUrl;
if (import.meta.env.MODE === 'production') {
  apiUrl = import.meta.env.VITE_API_URL || 'https://backend-linux-fmhqavhvc7gzb2fz.northeurope-01.azurewebsites.net/api';
} else {
  apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
}
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const resultDiv = document.getElementById("result");
const resultText = resultDiv.querySelector("p");
const errorDiv = document.getElementById("error");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function setIcon(isDark) {
  themeIcon.innerHTML = isDark
    ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
         d="M21.752 15.002A9.72 9.72 0 0 1 12 21.75c-5.385 
            0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 
            9.753 0 0 0 3 12c0 5.385 4.365 9.75 
            9.75 9.75s9.75-4.365 9.75-9.75c0-.837-.104-1.653-.298-2.435"></path>`
    : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
         d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 
            6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 
            0l-.707.707M6.343 17.657l-.707.707M16 
            12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  setIcon(isDark);
}

// Load saved theme or system preference
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

const isDark = savedTheme === "dark";
document.documentElement.classList.toggle("dark", isDark);
setIcon(isDark);

if (themeToggle && themeIcon) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Fetch and populate currencies
async function loadCurrencies() {
  try {
    const response = await fetch(`${apiUrl}/currencies`);
    if (!response.ok) throw new Error("Failed to fetch currencies");
    const currencies = await response.json();
    fromCurrencySelect.innerHTML = currencies
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
    toCurrencySelect.innerHTML = currencies
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "EUR";
    convert();
  } catch (err) {
    showError("Failed to load currencies");
  }
}

// Convert currency
async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencySelect.value;
  const to = toCurrencySelect.value;

  if (!amount || amount <= 0) {
    showError("Please enter a positive amount");
    return;
  }

  try {
    const response = await fetch(
      `${apiUrl}/convert?from=${from}&to=${to}&amount=${amount}`
    );
    if (!response.ok) throw new Error("Conversion failed");
    const data = await response.json();
    resultText.textContent = `${amount} ${from} = ${data.result.toFixed(
      2
    )} ${to}`;
    resultDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");
  } catch (err) {
    showError("Conversion failed. Please try again.");
  }
}

// Show error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
}

// Event listeners
amountInput.addEventListener("input", convert);
fromCurrencySelect.addEventListener("change", convert);
toCurrencySelect.addEventListener("change", convert);

// Initialize
loadCurrencies();
