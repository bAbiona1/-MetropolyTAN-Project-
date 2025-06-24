const bcrypt = require("bcryptjs");
const password = "secureAdminPassword123!"; // Mot de passe admin par défaut
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error("Erreur lors du hachage du mot de passe:", err);
        return;
    }
    console.log("Mot de passe haché pour l'admin:");
    console.log(hash);
});

