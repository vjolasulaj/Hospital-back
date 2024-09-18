const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/continents", async (req, res) => {
  try {
    const response = await axios.get("https://disease.sh/v3/covid-19/continents");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching COVID-19 data for continents.");
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// Endpoint to get countries COVID DATA
router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get("https://disease.sh/v3/covid-19/countries");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching covid data for countries");
    res.status(500).json({ error: "Failed to fetch data." });
  }
});
module.exports = router;

// Endpoint for a specific country (Albania)
router.get("/country", async (req, res) => {
  try {
    const response = await axios.get("https://disease.sh/v3/covid-19/countries/Albania?strict=true");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching covid data for Albania.");
    res.status(500).json({ error: "Failed to fetch data." });
  }
});
