const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all lines
router.get("/", async (req, res) => {
  try {
    // Join with mode table to get mode libelle
    const [rows] = await pool.query(`
      SELECT l.id, l.name, l.mode_id, m.libelle as mode_libelle
      FROM line l
      JOIN mode m ON l.mode_id = m.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET a single line by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT l.id, l.name, l.mode_id, m.libelle as mode_libelle
      FROM line l
      JOIN mode m ON l.mode_id = m.id
      WHERE l.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Line not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST (create) a new line
router.post("/", async (req, res) => {
  try {
    const { name, mode_id } = req.body;
    // Basic validation
    if (!name || mode_id === undefined) {
        return res.status(400).json({ msg: "Please include name and mode_id" });
    }

    // Check if mode_id exists in the mode table
    const [modeExists] = await pool.query("SELECT id FROM mode WHERE id = ?", [mode_id]);
    if (modeExists.length === 0) {
        return res.status(400).json({ msg: `Mode with id ${mode_id} does not exist` });
    }

    // The SQL schema has AUTO_INCREMENT for line.id, so we don't provide it in the INSERT
    const [result] = await pool.query(
      "INSERT INTO line (name, mode_id) VALUES (?, ?)",
      [name, mode_id]
    );
    const insertId = result.insertId;

    // Fetch the newly created line
    const [newLine] = await pool.query(`
        SELECT l.id, l.name, l.mode_id, m.libelle as mode_libelle
        FROM line l
        JOIN mode m ON l.mode_id = m.id
        WHERE l.id = ?
    `, [insertId]);
    res.status(201).json(newLine[0]);
  } catch (err) {
    console.error(err.message);
    // Handle potential foreign key constraint errors if mode_id doesn't exist (though checked above)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ msg: `Invalid mode_id: ${req.body.mode_id}` });
    }
    res.status(500).send("Server Error");
  }
});

// PUT (update) a line by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mode_id } = req.body;

    // Check if line exists
    const [existing] = await pool.query("SELECT * FROM line WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Line not found" });
    }

    // Build update query dynamically
    let updateFields = [];
    let queryParams = [];
    if (name !== undefined) {
        updateFields.push("name = ?");
        queryParams.push(name);
    }
    if (mode_id !== undefined) {
        // Check if the new mode_id exists
        const [modeExists] = await pool.query("SELECT id FROM mode WHERE id = ?", [mode_id]);
        if (modeExists.length === 0) {
            return res.status(400).json({ msg: `Mode with id ${mode_id} does not exist` });
        }
        updateFields.push("mode_id = ?");
        queryParams.push(mode_id);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ msg: "No fields provided for update" });
    }

    queryParams.push(id); // Add id for the WHERE clause

    const sql = `UPDATE line SET ${updateFields.join(", ")} WHERE id = ?`;

    await pool.query(sql, queryParams);

    // Fetch the updated line
    const [updatedLine] = await pool.query(`
        SELECT l.id, l.name, l.mode_id, m.libelle as mode_libelle
        FROM line l
        JOIN mode m ON l.mode_id = m.id
        WHERE l.id = ?
    `, [id]);
    res.json(updatedLine[0]);

  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ msg: `Invalid mode_id: ${req.body.mode_id}` });
    }
    res.status(500).send("Server Error");
  }
});

// DELETE a line by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if line exists
    const [existing] = await pool.query("SELECT * FROM line WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Line not found" });
    }

    // Note: Consider foreign key constraints. Deleting a line might fail
    // if it's referenced by a stop.
    const [result] = await pool.query("DELETE FROM line WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Line not found" });
    }

    res.json({ msg: "Line deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ msg: "Cannot delete line because it is referenced by one or more stops." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

