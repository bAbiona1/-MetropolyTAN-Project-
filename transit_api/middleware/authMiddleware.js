const jwt = require("jsonwebtoken");

// Configuration (idéalement, JWT_SECRET devrait être une variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || "votre_super_secret_jwt_ici_a_changer_en_production";

/**
 * Middleware pour vérifier le token JWT.
 * Le token doit être fourni dans l'en-tête Authorization sous la forme "Bearer <token>".
 */
const authMiddleware = (req, res, next) => {
  // Récupérer le token de l'en-tête Authorization
  const authHeader = req.header("Authorization");

  // Vérifier si l'en-tête Authorization est présent et bien formaté
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Accès non autorisé. Token manquant ou mal formaté." });
  }

  const token = authHeader.substring(7, authHeader.length); // Extrait le token après "Bearer "

  // Vérifier si le token est présent après extraction
  if (!token) {
    return res.status(401).json({ msg: "Accès non autorisé. Token manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter les informations de l'utilisateur décodé à l'objet request
    // pour qu'elles soient accessibles dans les routes protégées
    req.user = decoded.user;
    next(); // Passer au prochain middleware ou à la route
  } catch (err) {
    console.error("Erreur de vérification du token:", err.message);
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expiré." });
    }
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Token invalide." });
    }
    res.status(401).json({ msg: "Token non valide." });
  }
};

// Middleware optionnel pour vérifier si l'utilisateur a le rôle 'admin'
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Accès refusé. Rôle administrateur requis." });
  }
};

module.exports = { authMiddleware, adminOnly };

