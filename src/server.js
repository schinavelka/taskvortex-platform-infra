
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables (.env file only used for local development)
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'qa') {
  dotenv.config();
}

const app = express();

// 1. DYNAMIC CONFIGURATION BASED ON ENVIRONMENT
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const DB_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/taskvortex_dev';

// 2. ENVIRONMENT-BASED CORS SECURITY
const allowedOrigins = {
  development: ['http://localhost:3000', 'http://localhost:5173'],
  qa: ['https://qa.taskvortex.internal'],
  production: ['https://taskvortex.com']
};

app.use(cors({
  origin: allowedOrigins[ENV] || '*'
}));

app.use(express.json());

// 3. APPLICATION ROUTES
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: "Set up network tunnel", status: "Done" },
    { id: 2, title: "Configure environment variables", status: "In Progress" },
    { id: 3, title: "Build multi-stage DevOps pipeline", status: "Todo" }
  ]);
});

// 4. DEVOPS HEALTH CHECK ENDPOINT (Crucial for QA/PROD readiness checks)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 5. SERVER INITIALIZATION WITH LOGGING LEVEL SIMULATION
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 TASKVORTEX BACKEND RUNNING IN [${ENV.toUpperCase()}] MODE`);
  console.log(`🔌 Listening on port: ${PORT}`);
  console.log(`📦 Connected to Database stub: ${DB_URI.replace(/:([^:@\s]+)@/, ':****@')}`); // Masking passwords in logs
  console.log(`=========================================`);
});