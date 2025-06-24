const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API d\'Optimisation de Trajets",
    version: "1.2.0", // Version incrémentée pour l'ajout de l'authentification
    description: "Documentation de l\'API pour la gestion des données de transports publics (arrêts, lignes, modes, localisations) avec authentification JWT.",
    contact: {
      name: "Support API",
      // email: "support@example.com" // Optionnel
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1", // Ajustez si votre URL de base ou port est différent
      description: "Serveur de développement local",
    },
  ],
  components: {
    schemas: {
      // ... (tous les schémas existants restent ici : Location, Mode, Line, Stop, etc.)
      Location: {
        type: "object",
        required: ["id", "adresse", "latitude", "longitude"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique de la localisation.", example: 1 },
          adresse: { type: "string", description: "Adresse de la localisation.", example: "Champ du Cerf, Montbéliard" },
          latitude: { type: "string", description: "Latitude de la localisation.", example: "47.508" },
          longitude: { type: "string", description: "Longitude de la localisation.", example: "6.802" },
        },
      },
      LocationInput: {
        type: "object",
        required: ["id", "adresse", "latitude", "longitude"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique pour la nouvelle localisation.", example: 10 },
          adresse: { type: "string", description: "Adresse de la localisation.", example: "Nouvelle Adresse, Ville" },
          latitude: { type: "string", description: "Latitude de la localisation.", example: "47.123" },
          longitude: { type: "string", description: "Longitude de la localisation.", example: "6.456" },
        },
      },
      LocationUpdateInput: {
        type: "object",
        properties: {
          adresse: { type: "string", description: "Nouvelle adresse de la localisation.", example: "Adresse Mise à Jour, Ville" },
          latitude: { type: "string", description: "Nouvelle latitude de la localisation.", example: "47.124" },
          longitude: { type: "string", description: "Nouvelle longitude de la localisation.", example: "6.457" },
        },
      },
      Mode: {
        type: "object",
        required: ["id", "libelle"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique du mode de transport.", example: 1 },
          libelle: { type: "string", description: "Nom du mode de transport (ex: Bus, Train).", example: "Bus" },
        },
      },
      ModeInput: {
        type: "object",
        required: ["id", "libelle"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique pour le nouveau mode.", example: 3 },
          libelle: { type: "string", description: "Nom du mode de transport.", example: "Tramway" },
        },
      },
      ModeUpdateInput: {
        type: "object",
        required: ["libelle"],
        properties: {
          libelle: { type: "string", description: "Nouveau nom du mode de transport.", example: "Bus Express" },
        },
      },
      Line: {
        type: "object",
        required: ["id", "name", "mode_id"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique de la ligne.", example: 1 },
          name: { type: "string", description: "Nom de la ligne.", example: "Ligne A" },
          mode_id: { type: "integer", format: "int32", description: "ID du mode de transport associé.", example: 1 },
          mode_libelle: { type: "string", description: "Libellé du mode de transport associé (jointure).", example: "Bus" },
        },
      },
      LineInput: {
        type: "object",
        required: ["name", "mode_id"],
        properties: {
          name: { type: "string", description: "Nom de la nouvelle ligne.", example: "Ligne C" },
          mode_id: { type: "integer", format: "int32", description: "ID du mode de transport existant pour cette ligne.", example: 2 },
        },
      },
      LineUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nouveau nom de la ligne.", example: "Ligne A Express" },
          mode_id: { type: "integer", format: "int32", description: "Nouvel ID du mode de transport existant pour cette ligne.", example: 1 },
        },
      },
      Stop: {
        type: "object",
        required: ["id", "stop_name", "heure_passage", "line_id", "location_id"],
        properties: {
          id: { type: "integer", format: "int32", description: "ID unique de l\'arrêt." },
          stop_name: { type: "string", description: "Nom de l\'arrêt." },
          heure_passage: { type: "string", format: "time", description: "Heure de passage à l\'arrêt (HH:MM:SS)." },
          parent_stop_id: { type: "integer", format: "int32", nullable: true, description: "ID de l\'arrêt parent (optionnel)." },
          parent_stop_name: { type: "string", nullable: true, description: "Nom de l\'arrêt parent (jointure, optionnel)." },
          line_id: { type: "integer", format: "int32", description: "ID de la ligne associée." },
          line_name: { type: "string", description: "Nom de la ligne associée (jointure)." },
          mode_id: { type: "integer", format: "int32", description: "ID du mode de la ligne associée (jointure)." },
          mode_libelle: { type: "string", description: "Libellé du mode de la ligne associée (jointure)." },
          location_id: { type: "integer", format: "int32", description: "ID de la localisation de l\'arrêt." },
          location_adresse: { type: "string", description: "Adresse de la localisation de l\'arrêt (jointure)." },
          location_latitude: { type: "string", description: "Latitude de la localisation de l\'arrêt (jointure)." },
          location_longitude: { type: "string", description: "Longitude de la localisation de l\'arrêt (jointure)." },
        },
      },
      StopInput: {
        type: "object",
        required: ["name", "heure_passage", "line_id", "location_id"],
        properties: {
          name: { type: "string", description: "Nom du nouvel arrêt.", example: "Nouvel Arrêt" },
          heure_passage: { type: "string", format: "time", description: "Heure de passage (HH:MM:SS).", example: "10:30:00" },
          parent_stop_id: { type: "integer", format: "int32", nullable: true, description: "ID d\'un arrêt parent existant (optionnel).", example: 1 },
          line_id: { type: "integer", format: "int32", description: "ID d\'une ligne existante.", example: 1 },
          location_id: { type: "integer", format: "int32", description: "ID d\'une localisation existante.", example: 2 },
        },
      },
      StopUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nouveau nom de l\'arrêt." },
          heure_passage: { type: "string", format: "time", description: "Nouvelle heure de passage (HH:MM:SS)." },
          parent_stop_id: { type: "integer", format: "int32", nullable: true, description: "Nouvel ID d\'un arrêt parent existant (optionnel)." },
          line_id: { type: "integer", format: "int32", description: "Nouvel ID d\'une ligne existante." },
          location_id: { type: "integer", format: "int32", description: "Nouvel ID d\'une localisation existante." },
        },
      },
      UserLogin: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "secureAdminPassword123!" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          expiresIn: { type: "integer", example: 3600 },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              role: { type: "string" },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          msg: { type: "string", description: "Message d\'erreur." },
        },
      },
      SuccessMessage: {
        type: "object",
        properties: {
          msg: { type: "string", description: "Message de succès." },
        },
      },
    },
    securitySchemes: {
      bearerAuth: { // Nom du schéma de sécurité
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Format du token
        description: "Entrez le token JWT avec le préfixe Bearer. Exemple: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
      },
    },
    responses: { // Réponses standardisées
        UnauthorizedError: {
            description: "Erreur d\'authentification (token manquant, invalide ou expiré, ou identifiants incorrects pour /login).",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    }
                }
            }
        },
        ForbiddenError: {
            description: "Accès refusé (rôle insuffisant).",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    }
                }
            }
        },
        NotFoundError: {
            description: "La ressource demandée n\'a pas été trouvée.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    }
                }
            }
        },
        ServerError: {
            description: "Erreur interne du serveur.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    }
                }
            }
        }
    }
  },
  security: [
    {
      bearerAuth: [], // Applique bearerAuth globalement à toutes les routes par défaut
                      // Les routes publiques comme /auth/login devront explicitement le désactiver avec security: []
    },
  ],
  tags: [
    { name: "Locations", description: "Gestion des localisations" },
    { name: "Modes", description: "Gestion des modes de transport" },
    { name: "Lines", description: "Gestion des lignes de transport" },
    { name: "Stops", description: "Gestion des arrêts" },
    { name: "Authentication", description: "Authentification des utilisateurs" },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions (JSDoc comments)
  apis: ["./routes/*.js"], // Assurez-vous que les annotations JSDoc dans les fichiers de routes sont correctes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

