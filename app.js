require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cron = require("node-cron");
const stats = require("simple-statistics");

// Initialize Express
const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

connectToDatabase();

// Define a Schema and Model
const coinSchema = {
  coin: String,
  price: Number,
  market_cap: Number,
  change_24h: Number,
  timestamp: Date,
};

const CoinData = client
  .db("cryptoDB")
  .collection("coin_data");

// Fetch and Store Data from CoinGecko API
async function fetchAndStoreData() {
  try {
    const response = await axios.get(process.env.COINGECKO_API_URL);
    const data = response.data;
    const timestamp = new Date();

    const coinsData = [
      {
        coin: "bitcoin",
        price: data.bitcoin.usd,
        market_cap: data.bitcoin.usd_market_cap,
        change_24h: data.bitcoin.usd_24h_change,
        timestamp,
      },
      {
        coin: "ethereum",
        price: data.ethereum.usd,
        market_cap: data.ethereum.usd_market_cap,
        change_24h: data.ethereum.usd_24h_change,
        timestamp,
      },
      {
        coin: "matic-network",
        price: data["matic-network"].usd,
        market_cap: data["matic-network"].usd_market_cap,
        change_24h: data["matic-network"].usd_24h_change,
        timestamp,
      },
    ];

    await CoinData.insertMany(coinsData);
    console.log(`Data stored successfully at ${timestamp}`);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Schedule the Job (Every 2 hours)
cron.schedule("0 */2 * * *", fetchAndStoreData);

// API Endpoints
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


app.get("/stats", async (req, res) => {
  const { coin } = req.query;
  if (!coin)
    return res.status(400).json({ error: "Coin parameter is required" });

  try {

    const coinData = await CoinData.findOne(
      { coin },
      { sort: { timestamp: -1 } }
    );
    console.log(coinData);
    if (coinData) {
      res.json({
        price: coinData.price,
        marketCap: coinData.market_cap,
        change24h: coinData.change_24h,
        timestamp: coinData.timestamp,
      });
    } else {
      res.status(404).json({ error: "Coin not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


app.get("/deviation", async (req, res) => {
  const { coin } = req.query;
  if (!coin)
    return res.status(400).json({ error: "Coin parameter is required" });

  try {
    const last100Records = await CoinData.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    if (last100Records.length < 2) {
      return res
        .status(400)
        .json({ error: "Not enough data to calculate deviation" });
    }

    const prices = last100Records.map((record) => record.price);
    const deviation = stats.standardDeviation(prices);

    res.json({ deviation: deviation.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running`);
});
