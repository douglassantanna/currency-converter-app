const apiUrl = 'http://localhost:3000/api';

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const resultDiv = document.getElementById('result');
const resultText = resultDiv.querySelector('p');
const errorDiv = document.getElementById('error');

// Fetch and populate currencies
async function loadCurrencies() {
  try {
    const response = await fetch(`${apiUrl}/currencies`);
    if (!response.ok) throw new Error('Failed to fetch currencies');
    const currencies = await response.json();
    fromCurrencySelect.innerHTML = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
    toCurrencySelect.innerHTML = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
    convert();
  } catch (err) {
    showError('Failed to load currencies');
  }
}

// Convert currency
async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencySelect.value;
  const to = toCurrencySelect.value;

  if (!amount || amount <= 0) {
    showError('Please enter a positive amount');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/convert?from=${from}&to=${to}&amount=${amount}`);
    if (!response.ok) throw new Error('Conversion failed');
    const data = await response.json();
    resultText.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
  } catch (err) {
    showError('Conversion failed. Please try again.');
  }
}

// Show error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
}

// Event listeners
amountInput.addEventListener('input', convert);
fromCurrencySelect.addEventListener('change', convert);
toCurrencySelect.addEventListener('change', convert);

// Initialize
loadCurrencies();