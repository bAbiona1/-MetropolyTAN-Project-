const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDef");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();

// CORS middleware – doit venir avant TOUTES les routes
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

// Middleware pour parser les corps en JSON
app.use(express.json());

// Base URL de l'API
const API_BASE_URL = "/api/v1";

// Importation des routeurs
const authRouter = require("./routes/auth");
const locationsRouter = require("./routes/locations");
const modesRouter = require("./routes/modes");
const linesRouter = require("./routes/lines");
const stopsRouter = require("./routes/stops");

// Routes publiques
app.use(`${API_BASE_URL}/auth`, authRouter);

// Routes protégées
app.use(`${API_BASE_URL}/locations`, authMiddleware, locationsRouter);
app.use(`${API_BASE_URL}/modes`, authMiddleware, modesRouter);
app.use(`${API_BASE_URL}/lines`, authMiddleware, linesRouter);
app.use(`${API_BASE_URL}/stops`, authMiddleware, stopsRouter);

// Swagger UI – accès public
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route d’accueil
app.get("/", (req, res) => {
  res.send("Transit API is running. Access endpoints under /api/v1. API Documentation available at /api-docs. Authenticate via /api/v1/auth/login to access protected routes.");
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. API docs at http://localhost:${PORT}/api-docs`);
});

// Export (utile pour les tests)
module.exports = app;
