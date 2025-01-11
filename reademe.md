

# Crypto Data Tracker

This is a cryptocurrency data tracker API built with **Node.js**, **Express**, **MongoDB**, and **CoinGecko API**. The API fetches cryptocurrency data (Bitcoin, Ethereum, and Matic) from CoinGecko every 2 hours and stores it in MongoDB. It provides endpoints to view real-time data and calculate the price deviation based on the last 100 records.

## Features

- Fetches cryptocurrency data from the [CoinGecko API](https://www.coingecko.com/en/api) every 2 hours.
- Stores data such as coin prices, market cap, and 24-hour price changes.
- Provides API endpoints to:
  - Get the latest data of a coin.
  - Calculate the standard deviation of a coin's price based on the last 100 records.
- Runs on **Node.js**, with **Express** as the web framework and **MongoDB** for data storage.
- Cron job to schedule the fetching of data every 2 hours.

## Deployment

The server is deployed and accessible at:  
[http://144.24.112.242/](http://144.24.112.242/)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/crypto-data-tracker.git
   cd crypto-data-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGO_URI=your_mongo_db_connection_string
   COINGECKO_API_URL=https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd&include_market_cap=true&include_24hr_change=true
   PORT=8000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The server will be running at `http://localhost:8000`.

## API Endpoints

### 1. `/` - Health Check
Returns a simple message to indicate that the server is running.
- **Method**: `GET`
- **Response**:
  ```json
  {
    "message": "Server is running"
  }
  ```

### 2. `/stats` - Get Coin Stats
Fetches the latest stats for a given coin.
- **Method**: `GET`
- **Query Parameters**:
  - `coin`: The name of the coin (e.g., `bitcoin`, `ethereum`, `matic-network`).
- **Response**:
  ```json
  {
    "price": 50000,
    "marketCap": 1000000000000,
    "change24h": 2.5,
    "timestamp": "2025-01-12T00:00:00Z"
  }
  ```
- **Error Response** (if coin is not found):
  ```json
  {
    "error": "Coin not found"
  }
  ```

### 3. `/deviation` - Calculate Price Deviation
Calculates the standard deviation of the last 100 price records for a given coin.
- **Method**: `GET`
- **Query Parameters**:
  - `coin`: The name of the coin (e.g., `bitcoin`, `ethereum`, `matic-network`).
- **Response**:
  ```json
  {
    "deviation": "100.50"
  }
  ```
- **Error Response** (if not enough data to calculate deviation):
  ```json
  {
    "error": "Not enough data to calculate deviation"
  }
  ```

## Cron Job

The server is set up to fetch new data from CoinGecko every 2 hours using a cron job. You can check the status of the cron job or adjust the frequency by modifying the `cron.schedule` function in the code.



## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing coin data
- **CoinGecko API** - Provides cryptocurrency data
- **Cron Jobs** - Scheduled tasks for fetching data periodically
- **dotenv** - For managing environment variables
- **axios** - For making HTTP requests to CoinGecko API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
