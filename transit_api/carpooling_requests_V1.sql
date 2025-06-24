/*
DROP TABLE IF EXISTS stop;
DROP TABLE IF EXISTS line;
DROP TABLE IF EXISTS mode;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS users; -- Ajout pour la suppression de la table users si elle existe
*/

CREATE TABLE IF NOT EXISTS location (
                                        id INT AUTO_INCREMENT,
                                        adresse VARCHAR(50),
                                        latitude TEXT,
                                        longitude TEXT,
                                        PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS mode (
                                    id INT AUTO_INCREMENT,
                                    libelle VARCHAR(50),
                                    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS line (
                                    id INT AUTO_INCREMENT,
                                    name VARCHAR(50),
                                    mode_id INT NOT NULL,
                                    PRIMARY KEY(id),
                                    FOREIGN KEY(mode_id) REFERENCES mode(id)
);

CREATE TABLE IF NOT EXISTS stop (
                                    id INT AUTO_INCREMENT,
                                    name VARCHAR(50),
                                    heure_passage TIME,
                                    parent_stop_id INT,
                                    line_id INT NOT NULL,
                                    location_id INT NOT NULL,
                                    PRIMARY KEY(id),
                                    FOREIGN KEY(parent_stop_id) REFERENCES stop(id),
                                    FOREIGN KEY(line_id) REFERENCES line(id),
                                    FOREIGN KEY(location_id) REFERENCES location(id)
);

-- Nouvelle table pour les utilisateurs
CREATE TABLE IF NOT EXISTS users (
                                   id INT AUTO_INCREMENT,
                                   username VARCHAR(50) NOT NULL UNIQUE,
                                   password VARCHAR(255) NOT NULL, -- Stocke le mot de passe haché
                                   role VARCHAR(20) NOT NULL DEFAULT 'user', -- Rôle de l'utilisateur (ex: 'admin', 'user')
                                   PRIMARY KEY(id)
);


/*
-- Exemples d'insertion pour les tables existantes
INSERT INTO mode (id, libelle)
VALUES
    (1, 'Bus'),
    (2, 'Train');

INSERT INTO location (id, adresse, latitude, longitude)
VALUES
    (1, 'Champ du Cerf, Montbéliard', '47.508', '6.802'),
    (2, 'Lamartine, Montbéliard', '47.505', '6.798'),
    (3, 'Acropole Quai 4, Montbéliard', '47.510', '6.814');

INSERT INTO location (id, adresse, latitude, longitude)
VALUES
    (4, 'Audincourt Gare', '47.483', '6.853'),
    (5, 'Hérimoncourt Gare', '47.462', '6.903'),
    (6, 'Valentigney Gare', '47.468', '6.775');

INSERT INTO line (id, name, mode_id)
VALUES
    (1, 'Ligne A', 1),
    (2, 'Ligne T5', 2);

INSERT INTO stop (id, name, heure_passage, parent_stop_id, line_id, location_id)
VALUES
    (1, 'Champ du Cerf', '07:58:00', NULL, 1, 1),
    (2, 'Lamartine', '08:00:00', 1, 1, 2),
    (3, 'Acropole Quai 4', '08:10:00', 2, 1, 3);

INSERT INTO stop (id, name, heure_passage, parent_stop_id, line_id, location_id)
VALUES
    (4, 'Montbéliard Gare', '09:00:00', NULL, 2, 3),
    (5, 'Audincourt Gare', '09:15:00', 4, 2, 4),
    (6, 'Hérimoncourt Gare', '09:30:00', 5, 2, 5),
    (7, 'Valentigney Gare', '09:45:00', 6, 2, 6);
*/

-- Insertion de l'utilisateur administrateur par défaut
-- Le mot de passe est 'secureAdminPassword123!' haché avec bcrypt (saltRounds = 10)
-- Hash: $2b$10$p3bclmZ8ZKTmhN7KNXfXgui2lCRs4bmDghuEKGYQmv1wf/65LlJq.
INSERT INTO users (username, password, role) VALUES ('admin', '$2b$10$p3bclmZ8ZKTmhN7KNXfXgui2lCRs4bmDghuEKGYQmv1wf/65LlJq.', 'admin');


SELECT * from location;
SELECT * from mode;
SELECT * from line;
SELECT * from stop;
SELECT * from users; -- Pour vérifier l'insertion de l'utilisateur

SELECT stop.name AS stop_name, stop.heure_passage, line.name AS line_name, location.adresse,
       parent_stop.name AS parent_stop_name, mode.libelle
FROM stop
         LEFT JOIN location ON stop.location_id = location.id
         LEFT JOIN line ON stop.line_id = line.id
         LEFT JOIN mode ON line.mode_id = mode.id
         LEFT JOIN stop AS parent_stop ON stop.parent_stop_id = parent_stop.id  -- Self-join to get parent stop name
ORDER BY stop.heure_passage;

