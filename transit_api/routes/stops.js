const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper function to check existence of related entities
const checkExistence = async (table, id) => {
  if (id === null || id === undefined) return true; // Allow null parent_stop_id
  const [rows] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
  return rows.length > 0;
};

// GET all stops with details
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        s.id,
        s.name AS stop_name,
        s.heure_passage,
        s.parent_stop_id,
        ps.name AS parent_stop_name,
        s.line_id,
        l.name AS line_name,
        l.mode_id,
        m.libelle AS mode_libelle,
        s.location_id,
        loc.adresse AS location_adresse,
        loc.latitude AS location_latitude,
        loc.longitude AS location_longitude
      FROM stop s
      JOIN line l ON s.line_id = l.id
      JOIN mode m ON l.mode_id = m.id
      JOIN location loc ON s.location_id = loc.id
      LEFT JOIN stop ps ON s.parent_stop_id = ps.id
      ORDER BY s.line_id, s.heure_passage;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET a single stop by ID with details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        s.id,
        s.name AS stop_name,
        s.heure_passage,
        s.parent_stop_id,
        ps.name AS parent_stop_name,
        s.line_id,
        l.name AS line_name,
        l.mode_id,
        m.libelle AS mode_libelle,
        s.location_id,
        loc.adresse AS location_adresse,
        loc.latitude AS location_latitude,
        loc.longitude AS location_longitude
      FROM stop s
      JOIN line l ON s.line_id = l.id
      JOIN mode m ON l.mode_id = m.id
      JOIN location loc ON s.location_id = loc.id
      LEFT JOIN stop ps ON s.parent_stop_id = ps.id
      WHERE s.id = ?;
    `;
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Stop not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST (create) a new stop
router.post("/", async (req, res) => {
  try {
    const { name, heure_passage, parent_stop_id = null, line_id, location_id } = req.body;

    // Basic validation
    if (!name || !heure_passage || line_id === undefined || location_id === undefined) {
      return res.status(400).json({ msg: "Please include name, heure_passage, line_id, and location_id" });
    }

    // Validate foreign keys existence
    const lineExists = await checkExistence("line", line_id);
    if (!lineExists) {
      return res.status(400).json({ msg: `Line with id ${line_id} does not exist` });
    }
    const locationExists = await checkExistence("location", location_id);
    if (!locationExists) {
      return res.status(400).json({ msg: `Location with id ${location_id} does not exist` });
    }
    if (parent_stop_id !== null) {
        const parentStopExists = await checkExistence("stop", parent_stop_id);
        if (!parentStopExists) {
            return res.status(400).json({ msg: `Parent stop with id ${parent_stop_id} does not exist` });
        }
    }

    // The SQL schema has AUTO_INCREMENT for stop.id
    const [result] = await pool.query(
      "INSERT INTO stop (name, heure_passage, parent_stop_id, line_id, location_id) VALUES (?, ?, ?, ?, ?)",
      [name, heure_passage, parent_stop_id, line_id, location_id]
    );
    const insertId = result.insertId;

    // Fetch the newly created stop with details
    const getNewStopQuery = `
      SELECT
        s.id, s.name AS stop_name, s.heure_passage, s.parent_stop_id, ps.name AS parent_stop_name,
        s.line_id, l.name AS line_name, l.mode_id, m.libelle AS mode_libelle,
        s.location_id, loc.adresse AS location_adresse, loc.latitude AS location_latitude, loc.longitude AS location_longitude
      FROM stop s
      JOIN line l ON s.line_id = l.id
      JOIN mode m ON l.mode_id = m.id
      JOIN location loc ON s.location_id = loc.id
      LEFT JOIN stop ps ON s.parent_stop_id = ps.id
      WHERE s.id = ?;
    `;
    const [newStop] = await pool.query(getNewStopQuery, [insertId]);
    res.status(201).json(newStop[0]);

  } catch (err) {
    console.error(err.message);
    // Handle potential foreign key constraint errors (should be caught by checks above, but for safety)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ msg: "Invalid line_id, location_id, or parent_stop_id" });
    }
    res.status(500).send("Server Error");
  }
});

// PUT (update) a stop by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, heure_passage, parent_stop_id, line_id, location_id } = req.body;

    // Check if stop exists
    const [existing] = await pool.query("SELECT * FROM stop WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Stop not found" });
    }

    // Build update query dynamically and validate FKs if provided
    let updateFields = [];
    let queryParams = [];

    if (name !== undefined) {
        updateFields.push("name = ?");
        queryParams.push(name);
    }
    if (heure_passage !== undefined) {
        updateFields.push("heure_passage = ?");
        queryParams.push(heure_passage);
    }
    if (parent_stop_id !== undefined) { // Allows setting parent_stop_id to null
        if (parent_stop_id !== null) {
            const parentStopExists = await checkExistence("stop", parent_stop_id);
            if (!parentStopExists) {
                return res.status(400).json({ msg: `Parent stop with id ${parent_stop_id} does not exist` });
            }
        }
        updateFields.push("parent_stop_id = ?");
        queryParams.push(parent_stop_id);
    }
    if (line_id !== undefined) {
        const lineExists = await checkExistence("line", line_id);
        if (!lineExists) {
            return res.status(400).json({ msg: `Line with id ${line_id} does not exist` });
        }
        updateFields.push("line_id = ?");
        queryParams.push(line_id);
    }
    if (location_id !== undefined) {
        const locationExists = await checkExistence("location", location_id);
        if (!locationExists) {
            return res.status(400).json({ msg: `Location with id ${location_id} does not exist` });
        }
        updateFields.push("location_id = ?");
        queryParams.push(location_id);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ msg: "No fields provided for update" });
    }

    queryParams.push(id); // Add id for the WHERE clause

    const sql = `UPDATE stop SET ${updateFields.join(", ")} WHERE id = ?`;

    await pool.query(sql, queryParams);

    // Fetch the updated stop with details
     const getUpdatedStopQuery = `
      SELECT
        s.id, s.name AS stop_name, s.heure_passage, s.parent_stop_id, ps.name AS parent_stop_name,
        s.line_id, l.name AS line_name, l.mode_id, m.libelle AS mode_libelle,
        s.location_id, loc.adresse AS location_adresse, loc.latitude AS location_latitude, loc.longitude AS location_longitude
      FROM stop s
      JOIN line l ON s.line_id = l.id
      JOIN mode m ON l.mode_id = m.id
      JOIN location loc ON s.location_id = loc.id
      LEFT JOIN stop ps ON s.parent_stop_id = ps.id
      WHERE s.id = ?;
    `;
    const [updatedStop] = await pool.query(getUpdatedStopQuery, [id]);
    res.json(updatedStop[0]);

  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ msg: "Invalid line_id, location_id, or parent_stop_id" });
    }
    res.status(500).send("Server Error");
  }
});

// DELETE a stop by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if stop exists
    const [existing] = await pool.query("SELECT * FROM stop WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Stop not found" });
    }

    // Note: Consider foreign key constraints. Deleting a stop might fail
    // if it's referenced as a parent_stop_id by another stop.
    const [result] = await pool.query("DELETE FROM stop WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Stop not found" });
    }

    res.json({ msg: "Stop deleted successfully" });
  } catch (err) {
    console.error(err.message);
    // Handle foreign key constraint violation (e.g., if another stop references this one)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ msg: "Cannot delete stop because it is referenced as a parent stop by another stop." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

