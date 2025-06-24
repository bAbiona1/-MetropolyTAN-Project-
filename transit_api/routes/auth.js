const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Configuration (idéalement, JWT_SECRET devrait être une variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || "votre_super_secret_jwt_ici_a_changer_en_production";
const JWT_EXPIRES_IN = "1h"; // Durée de validité du token

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentification des utilisateurs et gestion des tokens JWT
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur et retourne un token JWT.
 *     tags: [Authentication]
 *     security: [] # Indique que cette route est publique et ne nécessite pas de token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Connexion réussie, token JWT retourné.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Nom d'utilisateur ou mot de passe manquant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Identifiants invalides.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Nom d'utilisateur et mot de passe requis." });
    }

    // Récupérer l'utilisateur depuis la base de données
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ msg: "Identifiants invalides." }); // Utilisateur non trouvé
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Identifiants invalides." }); // Mot de passe incorrect
    }

    // Créer le payload du token JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    // Signer le token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }, // Le token expire en 1 heure
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          expiresIn: 3600, // en secondes
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error("Erreur lors de la connexion:", err.message);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;

