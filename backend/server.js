require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

const API_KEY = process.env.EXCHANGE_API_KEY;
const API_BASE = "https://v6.exchangerate-api.com/v6/";

if (!API_KEY) {
  console.error("API key is missing!");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.get("/api/currencies", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}${API_KEY}/latest/USD`);
    const currencies = Object.keys(response.data.conversion_rates);
    res.json(currencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch currencies" });
  }
});

app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid parameters" });
  }
  try {
    const response = await axios.get(
      `${API_BASE}${API_KEY}/pair/${from}/${to}/${amount}`
    );
    res.json({ result: response.data.conversion_result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// Fallback to serve index.html for any unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      res.status(500).send("Something went wrong");
    }
  });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
